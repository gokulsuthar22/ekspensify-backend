import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailSignUpDto {
  @Expose()
  @IsEmail({}, { message: '`email` must be a valid email' })
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString({ message: '`name` must be a string' })
  @IsNotEmpty()
  name: string;
}
