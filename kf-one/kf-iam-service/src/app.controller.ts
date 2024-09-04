import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  daprHost = process.env.DAPR_HOST || 'http://localhost';
  daprPort = process.env.DAPR_HTTP_PORT || '3510';
  pubsubName = 'kf-pubsub';
  topicName = 'kfone';
  pubsubEndpoint = `${this.daprHost}:${this.daprPort}/v1.0/publish/${this.pubsubName}/${this.topicName}`;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('createOrganization')
  @ApiOperation({ summary: 'Publish a message' })
  createOrganization(@Body() body: any): any {
    console.log('publishing', body);
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
