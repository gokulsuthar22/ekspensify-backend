import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignInDto {
  @Expose({ name: 'id_token' })
  @IsString({ message: '`id_token` must be a string' })
  @IsNotEmpty()
  idToken: string;
}
