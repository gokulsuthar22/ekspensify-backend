import { User } from '@prisma/client';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';
import { PaginatedResultDto } from '@/common/dtos/paginated-result.dto';

export class UserPaginatedResponseDto extends PaginatedResultDto<User> {
  @Type(() => UserDto)
  items: UserDto[];
}
