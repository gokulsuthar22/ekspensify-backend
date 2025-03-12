import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Roles } from '@/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RoleGuard } from '@/core/guards/role.guard';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionDto } from './dtos/transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAttachmentResponseDto } from './dtos/upload-attachment-response.dto';
import { TransactionAttachmentValidationPipe } from './pipes/trasaction-attachment-validation.pipe';
import { TransactionPaginatedResponseDto } from './dtos/transaction-paginatated-response.dto';
import { TransactionPaginationParamsDto } from './dtos/transaction-pagination-params.dto';
import { RequestStatementDto } from './dtos/request-statement.dto';

@Controller('transactions')
@UseGuards(AuthGuard, RoleGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(TransactionDto)
  create(@CurrentUser() user: any, @Body() data: CreateTransactionDto) {
    return this.transactionService.create({
      ...data,
      userId: user.id,
    });
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(TransactionPaginatedResponseDto)
  findMany(
    @CurrentUser() user: any,
    @Query() where: TransactionPaginationParamsDto,
  ) {
    return this.transactionService.findMany({
      ...where,
      userId: user.role !== 'ADMIN' ? user.id : undefined,
    });
  }

  @Post('upload-attachment')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(UploadAttachmentResponseDto)
  @UseInterceptors(FileInterceptor('attachment'))
  uploadIcons(
    @UploadedFile(new TransactionAttachmentValidationPipe())
    image: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.transactionService.uploadAttachment({ image, userId: user.id });
  }

  @Post('request-statement')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(UploadAttachmentResponseDto)
  requestStatement(
    @CurrentUser() user: any,
    @Body() data: RequestStatementDto,
  ) {
    return this.transactionService.requestStatement({
      start: data.start,
      end: data.end,
      userId: user.id,
      format: data.format,
      email: user.email,
      name: user.name,
    });
  }

  @Patch(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(TransactionDto)
  update(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTransactionDto,
  ) {
    return this.transactionService.update({ id, userId: user.id }, data);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(TransactionDto)
  delete(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.transactionService.delete({ id, userId: user.id });
  }
}
