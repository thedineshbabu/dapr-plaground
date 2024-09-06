import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { ConfigService } from './config.service';
import { DaprModule } from './dapr.module';
import { ConfigController } from './config.controller';
// import { HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule, DaprModule],
  controllers: [AppController, ConfigController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
