import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios'; // Import the 'axios' module
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  DAPR_HOST = process.env.DAPR_HOST || 'http://localhost';
  daprPort = process.env.DAPR_HTTP_PORT || '3500';
  pubsubEndpoint = `http://localhost:${this.daprPort}/v1.0/publish/cpubsub/kfone`;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('publish')
  @ApiOperation({ summary: 'Publish a message' })
  publishMessage(@Body() body: any): any {
    console.log('publishing', body);
    console.log();
    axios
      .post(this.pubsubEndpoint, body, {
        headers: {
          'content-type': 'application/cloudevents+json',
        },
      })
      .then(() => {
        return 1;
      })
      .catch((error) => {
        console.error('There was an error!', error);
        return 0;
      });
    return 1;
  }
}
