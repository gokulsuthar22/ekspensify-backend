import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMeUserDto {
  @Expose()
  @IsString({ message: '`name` must be a string' })
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString({ message: '`avatar` must be a string' })
  @IsNotEmpty()
  avatar: string;
}
