import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  Get,
  Param,
  Res,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

import { multerDocumentOptions } from 'src/shared/multer.config';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permissions.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { QueryDocumentDto } from './dto/query-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('Documents')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerDocumentOptions))
  @Permission('document.create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload document',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['title', 'file'],
    },
  })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentDto,
    @Req() req: any,
  ) {
    const userId: number = parseInt(req.user.user_id + '', 10);
    return await this.documentsService.createDocument(file, body, userId);
  }

  @Permission('document.read')
  @Get(':id/stream')
  async streamFile(@Param('id') id: number, @Res() res: Response) {
    const document = await this.documentsService.findById(id);
    if (!document) throw new NotFoundException('Document not found');

    const filePath = join(process.cwd(), document.file_url);
    if (!existsSync(filePath)) throw new NotFoundException('File missing');

    res.setHeader('Content-Type', document.file_type);
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }

  @Permission('document.read')
  @Get()
  async getAll(@Query() query: QueryDocumentDto) {
    return this.documentsService.findAll(query);
  }

  // GET /documents/:id
  @Permission('document.read')
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const doc = await this.documentsService.findById(id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  // PATCH /documents/:id
  @Permission('document.update')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.updateDocument(id, dto);
  }

  // DELETE /documents/:id
  @Permission('document.delete')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.documentsService.softDelete(id);
  }
}
