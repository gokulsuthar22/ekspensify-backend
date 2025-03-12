import { Expose, Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  role: string;

  @Expose()
  status: string;

  @Expose()
  @Transform(({ obj }) => obj?._count?.accounts)
  accounts: number;

  @Expose({ name: 'isVerified' })
  is_verified: boolean;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
