import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class EmailSignInDto {
  @Expose()
  @IsEmail({}, { message: '`email` must be a valid email' })
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsNumber({}, { message: '`otp` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  otp: number;
}
