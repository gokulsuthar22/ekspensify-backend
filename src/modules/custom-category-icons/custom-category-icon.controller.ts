import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomCategoryIconService } from './custom-category-icon.service';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RoleGuard } from '@/core/guards/role.guard';
import { Roles } from '@/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { CustomCategoryIconDto } from './dtos/custom-category-icon.dto';
import { CreateCustomCategoryIconDto } from './dtos/create-custom-category-icon.dto';
import { UpdateCustomCategoryIconDto } from './dtos/update-custom-category-icon.dto';
import { ParseIntPipe } from '@/core/pipes/parse-int.pipe';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CUSTOM_CATEGORY_ICON_CACHE_KEY } from './custom-category-icon.constants';

@Controller('categories/custom-icons')
@UseGuards(AuthGuard, RoleGuard)
export class CustomCategoryIconController {
  constructor(private customIconService: CustomCategoryIconService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  @CacheKey(CUSTOM_CATEGORY_ICON_CACHE_KEY)
  @UseInterceptors(CacheInterceptor)
  findMany(@CurrentUser() user: any) {
    return this.customIconService.findMany({
      isActive: user.role !== 'ADMIN' ? true : undefined,
    });
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  create(@Body() data: CreateCustomCategoryIconDto) {
    return this.customIconService.create(data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCustomCategoryIconDto,
  ) {
    return this.customIconService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.customIconService.delete(id);
  }
}
