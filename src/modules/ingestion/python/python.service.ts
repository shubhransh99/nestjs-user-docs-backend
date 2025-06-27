import { Injectable, Logger } from '@nestjs/common';
import { Document } from 'src/entities/document.entity';

@Injectable()
export class PythonService {
  private readonly logger = new Logger(PythonService.name);

  async simulateIngestion(
    document: Document,
  ): Promise<{ success: boolean; log: string }> {
    this.logger.log(
      `Simulating ingestion for document_id=${document.document_id}`,
    );

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Random success/failure (90% success rate)
    const success = Math.random() < 0.9;

    if (success) {
      return {
        success: true,
        log: `Document '${document.title}' ingested successfully.`,
      };
    } else {
      return {
        success: false,
        log: `Failed to ingest document '${document.title}' due to simulated error.`,
      };
    }
  }
}
