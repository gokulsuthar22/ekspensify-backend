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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RoleGuard } from '@/core/guards/role.guard';
import { Roles } from '@/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ParseIntPipe } from '@/core/pipes/parse-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryIconValidationPipe } from './pipes/category-icon-validation.pipe';
import { UploadIconResponseDto } from './dtos/upload-icon-response.dto';
import { CategoryInsightsResponseDto } from './dtos/category-insights-response.dto';
import { FilterCategoryInsightsDto } from './dtos/filter-category-insights.dto';

@Controller('categories')
@UseGuards(AuthGuard, RoleGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('insights')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(CategoryInsightsResponseDto)
  insights(
    @CurrentUser() user: any,
    @Query() query: FilterCategoryInsightsDto,
  ) {
    return this.categoryService.insights(
      user.id,
      query.type,
      query.startDate,
      query.endDate,
    );
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(CategoryDto)
  create(@CurrentUser() user: any, @Body() data: CreateCategoryDto) {
    return this.categoryService.create({
      ...data,
      userId: user.role !== 'ADMIN' ? user.id : null,
    });
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(CategoryDto)
  // @CacheKey(CATEGORY_CACHE_KEY)
  // @UseInterceptors(CacheInterceptor)
  findMany(@CurrentUser() user: any) {
    return this.categoryService.findMany({
      OR:
        user.role !== 'ADMIN'
          ? [
              { userId: null, isActive: true },
              { userId: user.id, isActive: true },
            ]
          : [{ userId: null }],
    });
  }

  @Post('upload-icon')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UploadIconResponseDto)
  @UseInterceptors(FileInterceptor('icon'))
  uploadIcons(
    @UploadedFile(new CategoryIconValidationPipe()) icon: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.categoryService.uploadIcon({ icon, userId: user.id });
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CategoryDto)
  update(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoryService.update(
      {
        id: +id,
        userId: user.role !== 'ADMIN' ? user.id : null,
      },
      data,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(CategoryDto)
  delete(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete({
      id: +id,
      userId: user.role !== 'ADMIN' ? user.id : null,
    });
  }
}
