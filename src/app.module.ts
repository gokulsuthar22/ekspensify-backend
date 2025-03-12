import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { UserModule } from './shared/user/user.module';
import { PersistenceModule } from './infra/persistence/persistence.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './modules/category/category.module';
import { MeModule } from './modules/me/me.module';
import { AccountModule } from './modules/account/account.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AppController } from 'app.controller';
import { CustomCategoryIconModule } from '@/modules/custom-category-icons/custom-category-icon.module';
import { BudgetModule } from './modules/budget/budget.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './common/services/corn.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as moment from 'moment';

moment.updateLocale('en', {
  week: {
    dow: 7,
  },
});

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    CommonModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt').secret,
        signOptions: {
          expiresIn: configService.get('jwt').expiresIn,
        },
      }),
    }),
    PersistenceModule.register({
      type: 'prisma',
      global: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: await redisStore({
            url: configService.get('redis').url,
          }),
        };
      },
    }),
    ScheduleModule.forRoot(),
    MeModule,
    AuthModule,
    UserModule,
    CategoryModule,
    AccountModule,
    TransactionModule,
    CustomCategoryIconModule,
    BudgetModule,
  ],
  providers: [CronService],
  controllers: [AppController],
})
export class AppModule {}
