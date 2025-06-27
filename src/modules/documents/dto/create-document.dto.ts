import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Title of the document',
    example: 'Report Q2 2025',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description of the document',
    example: 'Quarterly financial report',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
