// src/subscriber/subscriber.controller.ts
import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { Response } from 'express';

@Controller('dapr/subscribe')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Get()
  getHello(): any {
    return [
      {
        pubsubname: 'cpubsub',
        topic: 'organizations',
        route: 'dapr/subscribe/organizations',
      },
    ];
  }

  @Post('organizations')
  handleRabbitMQMessage(@Body() data: any) {
    console.log('Reached here');
    this.subscriberService.handleMessage(data);
    return { status: 'ok' };
  }
}
