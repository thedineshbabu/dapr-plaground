import { Controller, Get, HttpException, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrganizationDto } from './dtos';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import * as http from 'http'; // Add this line to import the 'http' module
import axios from 'axios'; // Add this line to import the 'axios' module

@Controller()
@ApiTags('api')
export class AppController {
  private readonly logger = new Logger();
  constructor(private readonly appService: AppService) {}

  daprHost = process.env.DAPR_HOST || 'http://localhost';
  daprPort = process.env.DAPR_HTTP_PORT || '3512';
  base_url = `${this.daprHost}:${this.daprPort}`;
  pubsubName = 'kf-pubsub';
  topicName = 'kfone';
  pubsubEndpoint = `${this.daprHost}:${this.daprPort}/v1.0/publish/${this.pubsubName}/${this.topicName}`;
  DAPR_SECRET_STORE = 'localsecretstore';
  SECRET_NAME = 'secret';

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
  // createOrganization(
  //   @Body() createOrganizationDto: CreateOrganizationDto,
  // ): any {
  //   console.log('Received Org details', createOrganizationDto);
  //   return 1;
  // }
  createOrganization(@Req() req: any, @Res() res: any): any {
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
        console.log('Organization 2 - :', parsedBody.data);
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }

      return res.sendStatus(200);
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
