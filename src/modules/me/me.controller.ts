import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RoleGuard } from '@/core/guards/role.guard';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { UpdateMeUserDto } from '@/shared/user/dtos/update-me-user.dto';
import { UserDto } from '@/shared/user/dtos/user.dto';
import { UserService } from '@/shared/user/user.service';

@Controller('users/me')
@UseGuards(AuthGuard, RoleGuard)
export class MeController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  getMe(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }

  @Patch()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  updateMe(@CurrentUser() user: any, @Body() data: UpdateMeUserDto) {
    return this.userService.updateById(user.id, data);
  }
}
