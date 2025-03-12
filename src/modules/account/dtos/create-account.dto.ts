import { AcType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @Expose()
  @IsString({ message: '`name` must be a string' })
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNumber({}, { message: '`balance` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  balance: number;

  @Expose()
  @IsIn(['BANK', 'WALLET'], { message: "`type` must be 'BANK' or 'WALLET'" })
  @IsString({ message: '`type` must be a string' })
  @IsNotEmpty()
  type: AcType;
}
