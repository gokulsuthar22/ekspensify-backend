import { Expose } from 'class-transformer';
import { PaginationParamsDto } from '@/common/dtos/pagination-params.dto';
import { IsOptional, IsString } from 'class-validator';

export class UserPaginationParamsDto extends PaginationParamsDto {
  @Expose()
  @IsString({ message: '`name` must be a string' })
  @IsOptional()
  name?: string;

  @Expose()
  @IsString({ message: '`email` must be a string' })
  @IsOptional()
  email?: string;
}
