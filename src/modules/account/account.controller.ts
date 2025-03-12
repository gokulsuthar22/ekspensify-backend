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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RoleGuard } from '@/core/guards/role.guard';
import { AccountService } from './account.service';
import { Roles } from '@/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { AccountDto } from './dtos/account.dto';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { ParseIntPipe } from '@/core/pipes/parse-int.pipe';
import { AccountSummeryResponseDto } from './dtos/account-summary-response.dto';
import { FilterAccountSummeryDto } from './dtos/filter-account-summary.dto';

@Controller('accounts')
@UseGuards(AuthGuard, RoleGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('summary')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountSummeryResponseDto)
  summary(@CurrentUser() user: any, @Query() query: FilterAccountSummeryDto) {
    return this.accountService.summary(user.id, query.startDate, query.endDate);
  }

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(AccountDto)
  create(@CurrentUser() user: any, @Body() data: CreateAccountDto) {
    return this.accountService.createOne({ ...data, userId: user.id });
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  findMany(@CurrentUser() user: any) {
    return this.accountService.findMany({ userId: user.id });
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  find(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.accountService.findOne({ id, userId: user.id });
  }

  @Patch(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() data: UpdateAccountDto,
  ) {
    return this.accountService.updateOne({ id, userId: user.id }, data);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.accountService.deleteOne({ id, userId: user.id });
  }
}
