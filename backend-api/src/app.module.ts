import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import ormConfig from 'typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { ReportService } from './modules/report/report.service';
import { ReportModule } from './modules/report/report.module';
import { UploadModule } from './modules/upload/upload.module';
import { SafetyModule } from './modules/safety/safety.module';
import { BlacklistModule } from './modules/blacklist/blacklist.module';
import { TestModule } from './modules/test/test.module';
import { StatsModule } from './modules/stats/stats.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
    AdminModule,
    ReportModule,
    UploadModule,
    SafetyModule,
    BlacklistModule,
    TestModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
