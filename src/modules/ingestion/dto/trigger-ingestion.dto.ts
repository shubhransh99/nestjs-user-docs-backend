import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TriggerIngestionDto {
  @ApiProperty({
    description: 'ID of the document to be ingested',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  document_id: number;
}
