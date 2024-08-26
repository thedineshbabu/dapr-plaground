// src/subscriber/subscriber.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';

@Controller('dapr/subscribe')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Post('orders')
  handleRabbitMQMessage(@Body() data: any) {
    this.subscriberService.handleMessage(data);
    return { status: 'ok' };
  }
}
