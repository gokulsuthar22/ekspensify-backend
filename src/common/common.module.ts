import { Global, Module } from '@nestjs/common';
import { UtilService } from './services/util.service';
import { PaginationService } from './services/pagination.service';

@Global()
@Module({
  providers: [UtilService, PaginationService],
  exports: [UtilService, PaginationService],
})
export class CommonModule {}
