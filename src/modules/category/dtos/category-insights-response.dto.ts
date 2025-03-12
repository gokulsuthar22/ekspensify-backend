import { Expose, Type } from 'class-transformer';
import { CategoryDto } from './category.dto';

export class CategoryInsightsResponseDto {
  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  @Type(() => Number)
  amount: number;
}
