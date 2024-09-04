import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import axios from 'axios';
import { CreateOrganizationDto, CreateEmployeeDto, eventWrapper } from './dtos';

@Controller()
@ApiTags('api')
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
  @ApiOperation({
    summary: 'A POST method API to create organization',
    description: 'A POST method API to create organization',
    operationId: 'createOrganization',
  })
  @ApiCreatedResponse({
    description: 'Organization has been successfully created.',
  }) // 201
  @ApiForbiddenResponse({ description: 'Forbidden.' }) // 403
  @ApiBody({ type: CreateOrganizationDto })
  createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): any {
    console.log('publishing Org details', createOrganizationDto);
    const eventObject: eventWrapper = {
      type: 'createOrganization',
      source: 'kf-one',
      data: createOrganizationDto,
    };
    axios
      .post(this.pubsubEndpoint, eventObject, {
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

  @Post('createEmployee')
  @ApiOperation({
    summary: 'A POST method API to create employee',
    description: 'A POST method API to create employee',
    operationId: 'create employee',
  })
  @ApiCreatedResponse({
    description: 'Employee has been successfully created.',
  }) // 201
  @ApiForbiddenResponse({ description: 'Forbidden.' }) // 403
  @ApiBody({ type: CreateEmployeeDto })
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): any {
    console.log('publishing Org details', createEmployeeDto);
    const eventObject: eventWrapper = {
      type: 'createEmployee',
      source: 'kf-one',
      data: createEmployeeDto,
    };
    axios
      .post(this.pubsubEndpoint, eventObject, {
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

  @Get('iamservice')
  @ApiOperation({
    summary: 'A GET method API to get iam service',
    description: 'A GET method API to get iam service',
    operationId: 'get iam service',
  })
  @ApiCreatedResponse({
    description: 'Successfully fetched iam service.',
  }) // 201
  @ApiForbiddenResponse({ description: 'Forbidden.' }) // 403
  async invokeIamService(): Promise<string> {
    console.log('Invoking IAM Service');
    return 'response from KF IAM Service';
  }
}
