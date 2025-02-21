import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
// import { ConfigService } from './config.service';
import { DaprModule } from './dapr.module';
// import { ConfigController } from './config.controller';
// import { HttpService } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserVerificationModule } from './user-verification/user-verification.module';

@Module({
  imports: [HttpModule, DaprModule, TypeOrmModule.forRoot(typeOrmConfig), UserVerificationModule],
  controllers: [AppController], //, ConfigController],
  providers: [AppService], //, ConfigService],
})
export class AppModule {}
