import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigurationService } from './configuration.service';
import { DaprModule } from './dapr.module';
import { ConfigurationController } from './configuration.controller';
import { ConfigModule } from '@nestjs/config';
import { DynamicConfigService } from './dynamic.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule,
    DaprModule,
  ],
  controllers: [AppController, ConfigurationController],
  providers: [ConfigurationService, DynamicConfigService],
  exports: [DynamicConfigService],
})
export class AppModule {}
