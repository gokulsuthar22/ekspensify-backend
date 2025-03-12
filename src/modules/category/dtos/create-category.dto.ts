import { TxType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsHexColor,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDto {
  @Expose()
  @IsString({ message: '`name` must be a string' })
  @IsNotEmpty()
  name: string;

  @Expose({ name: 'icon_id' })
  @IsNumber({}, { message: '`icon_id` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  iconId: number;

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'], { message: "`type` must be 'CREDIT' or 'DEBIT'" })
  @IsString({ message: '`type` must be a string' })
  @IsOptional()
  type?: TxType;

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
