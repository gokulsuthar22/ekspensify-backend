import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterCategoryDto {
  @Expose()
  @IsString({ message: '`slug` must be a string' })
  @IsOptional()
  slug?: string;

  @Expose({ name: 'is_active' })
  @IsBoolean({ message: '`is_active` must be a boolean' })
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;

  OR: any;
}
