import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { IngestionJob } from 'src/entities/ingestion-job.entity';
import { PythonService } from './python/python.service';
import { Document } from 'src/entities/document.entity';

@Module({
  imports: [SequelizeModule.forFeature([IngestionJob, Document])],
  controllers: [IngestionController],
  providers: [IngestionService, PythonService],
})
export class IngestionModule {}
