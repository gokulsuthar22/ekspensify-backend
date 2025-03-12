import { Module } from '@nestjs/common';
import { MediaModule } from '@/helper/media/media.module';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';
import { UserModule } from '@/shared/user/user.module';
import { CustomCategoryIconModule } from '@/modules/custom-category-icons/custom-category-icon.module';

@Module({
  imports: [UserModule, MediaModule, CustomCategoryIconModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository, CategoryService],
})
export class CategoryModule {}
