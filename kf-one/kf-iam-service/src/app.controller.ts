import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
import { DaprLogger } from './dapr.logger';

@Controller()
@ApiTags('api')
export class AppController {
  private readonly logger = new DaprLogger();
  constructor(private readonly appService: AppService) {}

  daprHost = process.env.DAPR_HOST || 'http://localhost';
  daprPort = process.env.DAPR_HTTP_PORT || '3500';
  base_url = `${this.daprHost}:${this.daprPort}`;
  pubsubName = process.env.PUBSUB_NAME || 'kf-pubsub';
  topicName = process.env.TOPIC_NAME || 'kfone';
  pubsubEndpoint = `${this.daprHost}:${this.daprPort}/v1.0/publish/${this.pubsubName}/${this.topicName}`;
  DAPR_SECRET_STORE = process.env.DAPR_SECRET_STORE || 'localsecretstore';
  SECRET_NAME = 'secret';

  @Get()
  getApp(): string {
    return 'KF IAM service is running';
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
    this.logger.info('publishing Org details', createOrganizationDto);
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
    this.logger.info('publishing Org details', createEmployeeDto);
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
        this.logger.error('There was an error!', error);
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
    this.logger.info('Invoking IAM Service');
    return 'response from KF IAM Service';
  }

  @Get('secret')
  @ApiOperation({
    summary: 'A GET method API to get secret',
    description: 'A GET method API to get secret',
    operationId: 'get secret',
  })
  @ApiCreatedResponse({
    description: 'Successfully fetched secret.',
  }) // 201
  @ApiForbiddenResponse({ description: 'Forbidden.' }) // 403
  async getSecret(): Promise<any> {
    this.logger.info('Fetching secret');
    try {
      const response = await axios.get(
        `${this.base_url}/v1.0/secrets/${this.DAPR_SECRET_STORE}/${this.SECRET_NAME}`,
      );
      this.logger.info('Secret fetched');
      return response.data; // Return the secret data
    } catch (error) {
      this.logger.error('Error fetching secret', error);
      throw new HttpException(
        'Failed to fetch secret',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post('configuration/configstore')
  // handleConfigUpdate(@Body() body: any) {
  //   this.logger.info(`Configuration update: ${JSON.stringify(body.items)}`);
  //   return { status: 200 };
  // }
}
