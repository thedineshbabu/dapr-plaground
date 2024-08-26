import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import * as http from 'http';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import axios from 'axios';
import { CreateOrganizationDto, CreateEmployeeDto } from './dtos';
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

  @Post('organization/create')
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
  // createOrganization(
  //   @Body() createOrganizationDto: CreateOrganizationDto,
  // ): any {
  //   console.log('Received Org details', createOrganizationDto);
  //   return 1;
  // }
  createOrganization(@Req() req: any, @Res() res: any): any {
    this.logger.log('Consuming Organization data in Service 2');
    const chunks: any[] = [];

    (req as http.IncomingMessage).on('data', (chunk) => {
      chunks.push(chunk);
    });

    (req as http.IncomingMessage).on('end', () => {
      const buffer = Buffer.concat(chunks);
      // console.log('Raw Buffer:', buffer);

      // If you want to convert the buffer to a string:
      const rawBody = buffer.toString('utf8');
      // console.log('Raw Body:', rawBody);

      // If the body is JSON, you can parse it:
      let parsedBody;
      try {
        parsedBody = JSON.parse(rawBody);
        this.logger.log('Organization :', JSON.stringify(parsedBody.data));
      } catch (err) {
        this.logger.error('Error parsing JSON:', err);
      }

      return res.status(HttpStatus.OK).json({
        message: 'Organization created successfully',
      });
    });
  }

  @Post('employee/create')
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
  createEmployee(@Req() req: any, @Res() res: any): any {
    this.logger.log('Consuming Employee data in Service 2');
    const chunks: any[] = [];

    (req as http.IncomingMessage).on('data', (chunk) => {
      chunks.push(chunk);
    });

    (req as http.IncomingMessage).on('end', () => {
      const buffer = Buffer.concat(chunks);
      // console.log('Raw Buffer:', buffer);

      // If you want to convert the buffer to a string:
      const rawBody = buffer.toString('utf8');
      // console.log('Raw Body:', rawBody);

      // If the body is JSON, you can parse it:
      let parsedBody;
      try {
        parsedBody = JSON.parse(rawBody);
        this.logger.log('Employee :', JSON.stringify(parsedBody.data));
      } catch (err) {
        this.logger.error('Error parsing JSON:', err);
      }

      return res.status(HttpStatus.OK).json({
        message: 'Employee created successfully',
      });
    });
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
      const response = await axios.get(
        `${this.base_url}/v1.0/secrets/${this.DAPR_SECRET_STORE}/${this.SECRET_NAME}`,
      );
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

  @Get('invokeservice1')
  async invokeService1(): Promise<any> {
    this.logger.log('Logging from Service 2');
    this.logger.log('Invoking Service 1');
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${this.daprHost}:${this.daprPort}/service1`,
      headers: {
        'dapr-app-id': 'service-1',
      },
    };

    axios
      .request(config)
      .then((response: { data: any }) => {
        this.logger.log(JSON.stringify(response.data));
      })
      .catch((error: any) => {
        this.logger.log(error);
      });

    return 1;
  }
}
