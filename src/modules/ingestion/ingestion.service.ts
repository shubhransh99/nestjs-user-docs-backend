import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  IngestionJob,
  IngestionStatus,
  IngestionTriggerType,
} from 'src/entities/ingestion-job.entity';
import { Document } from 'src/entities/document.entity';
import { PythonService } from './python/python.service';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @InjectModel(IngestionJob) private ingestionJobModel: typeof IngestionJob,
    @InjectModel(Document) private documentModel: typeof Document,
    private readonly pythonService: PythonService,
  ) {}

  async triggerIngestion(
    document_id: number,
    trigger_type: IngestionTriggerType,
    triggered_by?: number | null,
  ): Promise<IngestionJob> {
    const document = await this.documentModel.findByPk(document_id);
    if (!document) throw new NotFoundException('Document not found');

    const job = new this.ingestionJobModel();

    job.document_id = document_id;
    job.triggered_by = triggered_by || null;
    job.trigger_type = trigger_type;
    job.status = IngestionStatus.PENDING;

    await job.save();
    // Fire async process
    setImmediate(() => this.processIngestionJob(job.id));

    return job;
  }

  async processIngestionJob(job_id: number): Promise<void> {
    const job = await this.ingestionJobModel.findByPk(job_id, {
      include: [Document],
    });
    if (!job) {
      this.logger.error(`Ingestion job ${job_id} not found`);
      return;
    }

    try {
      job.status = IngestionStatus.PROCESSING;
      job.started_at = new Date();
      await job.save();

      const result = await this.pythonService.simulateIngestion(job.document);

      job.status = result.success
        ? IngestionStatus.SUCCESS
        : IngestionStatus.FAILED;
      job.log = result.log;
    } catch (error) {
      job.status = IngestionStatus.FAILED;
      job.log = `Error: ${error.message}`;
      this.logger.error(`Ingestion job ${job_id} failed: ${error.message}`);
    } finally {
      job.completed_at = new Date();
      await job.save();
    }
  }

  async getJobStatus(job_id: number): Promise<IngestionJob> {
    const job = await this.ingestionJobModel.findByPk(job_id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }
}
