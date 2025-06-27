import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDocumentDto {
  @ApiPropertyOptional({
    description: 'Search by document title (partial match)',
    example: 'report',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by creator (user_id)',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  created_by?: number;

  @ApiPropertyOptional({
    description: 'Filter by file MIME type',
    example: 'application/pdf',
  })
  @IsOptional()
  @IsString()
  file_type?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
