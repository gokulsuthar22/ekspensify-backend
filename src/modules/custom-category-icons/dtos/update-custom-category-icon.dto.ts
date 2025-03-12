import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsHexColor, IsOptional } from 'class-validator';

export class UpdateCustomCategoryIconDto {
  @Expose({ name: 'is_active' })
  @IsBoolean({ message: '`is_active` must be a boolean' })
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;

  @Expose({ name: 'ic_fill_color' })
  @IsHexColor({ message: '`ic_fill_color` must be a valid color hex' })
  @IsOptional()
  icFillColor?: string;
}
