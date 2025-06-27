import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from 'src/entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from 'src/entities/user.entity';
import { Op } from 'sequelize';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document)
    private readonly documentModel: typeof Document,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createDocument(
    file: Express.Multer.File,
    dto: CreateDocumentDto,
    userId: number,
  ): Promise<Document> {
    const file_url = `uploads/documents/${file.filename}`;
    const file_type = file.mimetype;

    const document = new this.documentModel();
    document.title = dto.title;
    document.description = dto.description ?? '';
    document.file_url = file_url;
    document.file_type = file_type;
    document.created_by = userId;

    return document.save();
  }

  async findById(documentId: number): Promise<Document | null> {
    return this.documentModel.findOne({
      where: { document_id: documentId },
    });
  }

  async findAll(query: QueryDocumentDto) {
    const where: any = {};
    if (query.title) where.title = { [Op.iLike]: `%${query.title}%` };
    if (query.created_by) where.created_by = query.created_by;
    if (query.file_type) where.file_type = query.file_type;

    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.documentModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      pageCount: Math.ceil(count / limit),
    };
  }

  async updateDocument(id: number, dto: UpdateDocumentDto) {
    const doc = await this.documentModel.findByPk(id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc.update(dto);
  }

  async softDelete(id: number) {
    const doc = await this.documentModel.findByPk(id);
    if (!doc) throw new NotFoundException('Document not found');
    await doc.destroy();
    return { message: 'Document deleted successfully' };
  }
}
