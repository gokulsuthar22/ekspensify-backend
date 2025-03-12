import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCustomCategoryIconDto {
  @Expose({ name: 'icon_id' })
  @IsNumber({}, { message: '`icon_id` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  iconId: number;

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
