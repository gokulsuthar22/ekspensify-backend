import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationParamsDto {
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;
}
