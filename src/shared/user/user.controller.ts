import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RoleGuard } from '@/core/guards/role.guard';
import { Roles } from '@/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { UserPaginatedResponseDto } from './dtos/user-paginatated-response.dto';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserPaginatedResponseDto)
  findMany(@Query() filter: any) {
    filter.role = 'USER';
    return this.userService.findMany(filter);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateById(id, data);
  }
}
