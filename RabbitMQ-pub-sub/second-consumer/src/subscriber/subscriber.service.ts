import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriberService {
  private readonly logger = new Logger(SubscriberService.name);

  handleMessage(data: any) {
    this.logger.log(`Received data 2: ${JSON.stringify(data)}`);
    // Process the data
  }
}
