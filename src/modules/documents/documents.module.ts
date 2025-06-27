import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Document } from 'src/entities/document.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Document, User])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
