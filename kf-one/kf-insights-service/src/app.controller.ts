import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrganizationDto, CreateEmployeeDto } from './dtos';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import * as http from 'http'; // Add this line to import the 'http' module

@Controller()
@ApiTags('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  daprHost = process.env.DAPR_HOST || 'http://localhost';
  daprPort = process.env.DAPR_HTTP_PORT || '3512';
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

  // @Post('createEmployee')
  // @ApiOperation({
  //   summary: 'A POST method API to create employee',
  //   description: 'A POST method API to create employee',
  //   operationId: 'create employee',
  // })
  // @ApiCreatedResponse({
  //   description: 'Employee has been successfully created.',
  // }) // 201
  // @ApiForbiddenResponse({ description: 'Forbidden.' }) // 403
  // @ApiBody({ type: CreateEmployeeDto })
  // createEmployee(@Req() req: any, @Res() res: any): any {
  //   const chunks: any[] = [];

  //   (req as http.IncomingMessage).on('data', (chunk) => {
  //     chunks.push(chunk);
  //   });

  //   (req as http.IncomingMessage).on('end', () => {
  //     const buffer = Buffer.concat(chunks);
  //     // console.log('Raw Buffer:', buffer);

  //     // If you want to convert the buffer to a string:
  //     const rawBody = buffer.toString('utf8');
  //     // console.log('Raw Body:', rawBody);

  //     // If the body is JSON, you can parse it:
  //     let parsedBody;
  //     try {
  //       parsedBody = JSON.parse(rawBody);
  //       console.log('Employee 2 - :', parsedBody.data);
  //     } catch (err) {
  //       console.error('Error parsing JSON:', err);
  //     }

  //     return res.sendStatus(200);
  //   });
  // }
}
