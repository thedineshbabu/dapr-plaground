import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import axios from 'axios';
import { CreateOrganizationDto, CreateEmployeeDto, eventWrapper } from './dtos';
import { DynamicConfigService } from './dynamic.config.service';
import { ConfigService } from '@nestjs/config';

@Controller()
@ApiTags('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private dynamicConfigService: DynamicConfigService,
    private configService: ConfigService,
  ) {}

  daprHost =
    this.dynamicConfigService.getConfig('DAPR_HOST') ??
    this.configService.get<string>('DAPR_HOST');
  daprPort =
    this.dynamicConfigService.getConfig('DAPR_HTTP_PORT') ??
    this.configService.get<string>('DAPR_HTTP_PORT');
  base_url = `${this.daprHost}:${this.daprPort}`;
  pubsubName =
    this.dynamicConfigService.getConfig('PUBSUB_NAME') ??
    this.configService.get<string>('PUBSUB_NAME');
  topicName =
    this.dynamicConfigService.getConfig('TOPIC_NAME') ??
    this.configService.get<string>('TOPIC_NAME');
  pubsubEndpoint = `${this.daprHost}:${this.daprPort}/v1.0/publish/${this.pubsubName}/${this.topicName}`;
  DAPR_SECRET_STORE =
    this.dynamicConfigService.getConfig('DAPR_SECRET_STORE') ??
    this.configService.get<string>('DAPR_SECRET_STORE');
  SECRET_NAME = 'secret';

  // daprHost = this.configService.get<string>('DAPR_HOST');
  // daprPort = this.configService.get<string>('DAPR_HTTP_PORT');
  // base_url = `${this.daprHost}:${this.daprPort}`;
  // pubsubName = this.configService.get<string>('PUBSUB_NAME');
  // topicName = this.configService.get<string>('TOPIC_NAME');
  // pubsubEndpoint = `${this.daprHost}:${this.daprPort}/v1.0/publish/${this.pubsubName}/${this.topicName}`;
  // DAPR_SECRET_STORE = this.configService.get<string>('DAPR_SECRET_STORE');
  // SECRET_NAME = 'secret';

  @Get()
  getApp(): string {
    return 'Service 1 is running';
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
    const eventObject: eventWrapper = {
      type: 'createOrganization',
      source: 'kf-one',
      data: createOrganizationDto,
    };
    this.logger.log('publishing Org details', JSON.stringify(eventObject));
    console.log('pubsubEndpoint', this.pubsubEndpoint);
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
    const eventObject: eventWrapper = {
      type: 'createEmployee',
      source: 'kf-one',
      data: createEmployeeDto,
    };
    this.logger.log('publishing Emp details', JSON.stringify(eventObject));
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

  @Get('service1')
  @ApiOperation({
    summary: 'A GET method API to get iam service',
    description: 'A GET method API to get iam service',
    operationId: 'get iam service',
  })
  @ApiCreatedResponse({
    description: 'Successfully fetched iam service.',
  }) // 201
  @ApiForbiddenResponse({ description: 'Forbidden.' }) // 403
  async service1(): Promise<string> {
    this.logger.log('logging from service 1');
    return 'response from service 1';
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
    this.logger.log('Fetching secret');
    try {
      const secretUrl = `${this.base_url}/v1.0/secrets/${this.DAPR_SECRET_STORE}/${this.SECRET_NAME}`;
      console.log('secretUrl', secretUrl);
      const response = await axios.get(secretUrl);
      const secretData = JSON.stringify(response.data);
      this.logger.log(`Secret Value: ` + secretData);
      this.logger.log('Secret fetched');
      return response.data; // Return the secret data
    } catch (error) {
      this.logger.error('Error fetching secret', error);
      throw new HttpException(
        'Failed to fetch secret',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
