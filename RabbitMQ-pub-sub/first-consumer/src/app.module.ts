import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriberModule } from './subscriber/subscriber.module';

@Module({
  imports: [SubscriberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
