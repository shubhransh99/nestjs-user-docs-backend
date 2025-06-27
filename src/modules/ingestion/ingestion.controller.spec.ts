import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionTriggerType } from 'src/entities/ingestion-job.entity';

describe('IngestionController', () => {
  let controller: IngestionController;

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
    getJobStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: mockIngestionService }],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should trigger ingestion (manual)', async () => {
    const result = { job_id: 1 };
    mockIngestionService.triggerIngestion.mockResolvedValue(result);

    const req = { user: { user_id: 42 } };
    const response = await controller.triggerIngestion(123, req as any);
    expect(response).toEqual(result);
    expect(mockIngestionService.triggerIngestion).toHaveBeenCalledWith(123, IngestionTriggerType.MANUAL, 42);
  });

  it('should trigger ingestion (webhook)', async () => {
    const result = { job_id: 1 };
    mockIngestionService.triggerIngestion.mockResolvedValue(result);

    const response = await controller.webhookIngestion(123);
    expect(response).toEqual(result);
    expect(mockIngestionService.triggerIngestion).toHaveBeenCalledWith(123, IngestionTriggerType.WEBHOOK, null);
  });

  it('should return ingestion job status', async () => {
    const result = { id: 1, status: 'pending' };
    mockIngestionService.getJobStatus.mockResolvedValue(result);

    const response = await controller.getJobStatus(1);
    expect(response).toEqual(result);
  });
});
