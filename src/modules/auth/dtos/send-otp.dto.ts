import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class SendOtpDto {
  @Expose()
  @IsEmail({}, { message: '`email` must be a valid email' })
  @IsNotEmpty()
  email: string;
}
