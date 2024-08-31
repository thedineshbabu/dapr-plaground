import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { Subscribe } from './dapr-subscriber.decorator';

@Controller('dapr/subscribe')
export class SubscriberController {
  private readonly logger = new Logger(SubscriberController.name);

  constructor(private readonly subscriberService: SubscriberService) {}

  @Get()
  get(): any {
    return [
      {
        pubsubname: 'cpubsub',
        topic: 'organizations',
        route: 'organizations',
      },
    ];
  }

  @Subscribe('organizations')
  @Post('organizations')
  handleMessage(@Body() data: any) {
    this.subscriberService.handleMessage(data);
    return { status: 'ok' };
  }
}
