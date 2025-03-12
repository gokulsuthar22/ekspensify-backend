import { Status } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: "`type` must be 'ACTIVE' or 'INACTIVE'",
  })
  @IsString({ message: '`status` must be a string' })
  @IsNotEmpty()
  status?: Status;
}
