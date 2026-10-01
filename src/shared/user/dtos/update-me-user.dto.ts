import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMeUserDto {
  @Expose()
  @IsString({ message: '`name` must be a string' })
  @IsOptional()
  name: string;

  @Expose()
  @IsString({ message: '`avatar` must be a string' })
  @IsOptional()
  avatar: string;

  @Expose({ name: 'fcm_token' })
  @IsString({ message: '`fcm_token` must be a string' })
  @IsOptional()
  fcmToken: string;
}
