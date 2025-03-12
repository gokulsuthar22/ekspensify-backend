import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @Expose()
  @IsString({ message: '`note` must be a string' })
  @IsOptional()
  @Transform(({ obj }) => {
    return obj?.note === '' ? null : obj?.note;
  })
  note?: string;

  @Expose({ name: 'attachment_id' })
  @IsNumber({}, { message: '`attachment_id` must be a number' })
  @Type(() => Number)
  @IsOptional()
  attachmentId?: number;
}
