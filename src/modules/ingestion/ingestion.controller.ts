import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionTriggerType } from 'src/entities/ingestion-job.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permissions.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';

@ApiTags('Ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger ingestion (Admin only)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('ingestion.trigger')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document_id: {
          type: 'number',
          example: 1,
          description: 'ID of the document to ingest',
        },
      },
      required: ['document_id'],
    },
  })
  async triggerIngestion(
    @Body('document_id', ParseIntPipe) document_id: number,
    @Req() req: Request,
  ) {
    const user = req.user as { user_id: number };
    return this.ingestionService.triggerIngestion(
      document_id,
      IngestionTriggerType.MANUAL,
      user.user_id,
    );
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Trigger ingestion via webhook (public)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document_id: {
          type: 'number',
          example: 1,
          description: 'ID of the document to ingest',
        },
      },
      required: ['document_id'],
    },
  })
  async webhookIngestion(
    @Body('document_id', ParseIntPipe) document_id: number,
  ) {
    return this.ingestionService.triggerIngestion(
      document_id,
      IngestionTriggerType.WEBHOOK,
      null,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':job_id/status')
  @ApiOperation({ summary: 'Get ingestion job status by ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'job_id',
    type: 'number',
    example: 123,
    description: 'ID of the ingestion job to check status for',
  })
  async getJobStatus(@Param('job_id', ParseIntPipe) job_id: number) {
    return this.ingestionService.getJobStatus(job_id);
  }
}
