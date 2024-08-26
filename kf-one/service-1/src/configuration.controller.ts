// import { Controller, Post, Body, Res } from '@nestjs/common';
// import { Response } from 'express';
// import { Logger } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('AppConfig')
// @Controller('configuration/configstore')
// export class ConfigurationController {
//   private readonly logger = new Logger(ConfigurationController.name);

//   @Post('*')
//   handleConfigUpdate(@Body() body: any, @Res() res: Response) {
//     this.logger.log(
//       `Received configuration update: ${JSON.stringify(body.items)}`,
//     );
//     res.sendStatus(200);
//   }
// }

import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DynamicConfigService } from './dynamic.config.service'; // Import the custom service

@ApiTags('AppConfig')
@Controller('configuration')
export class ConfigurationController {
  private readonly logger = new Logger(ConfigurationController.name);

  constructor(private dynamicConfigService: DynamicConfigService) {} // Inject the dynamic config service

  // @Post('pg-configstore/*')
  // handleConfigUpdate(@Body() body: any, @Res() res: Response) {
  //   this.logger.log(
  //     `Received configuration update: ${JSON.stringify(body.items)}`,
  //   );

  //   // body.items = {"kf1pubsub:":{"value":"rbt-pubsub","version":"v1.3"}};

  //   // read key and value from body.items

  //   for (const key in body.items) {
  //     if (body.items.hasOwnProperty(key)) {
  //       const value = body.items[key].value;
  //       // Use the key and value as needed
  //       console.log(`Key: ${key}, Value: ${value}`);
  //     }
  //   }

  //   res.status(200).json({ message: 'Configuration updated successfully' });
  // }

  @Post('pg-configstore/*')
  handleConfigUpdate(@Body() body: any, @Res() res: Response) {
    try {
      // Log the entire body received
      this.logger.log(`Received configuration update: ${JSON.stringify(body)}`);

      // Ensure the body has an 'items' field
      if (
        typeof body !== 'object' ||
        !body.items ||
        typeof body.items !== 'object'
      ) {
        throw new HttpException(
          'Invalid request body or missing "items"',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Extract the first key-value pair from 'items'
      const entries = Object.entries(body.items);

      if (entries.length === 0) {
        throw new HttpException('Items field is empty', HttpStatus.BAD_REQUEST);
      }

      const [key, config] = entries[0];

      // Check if the config is an object and has a 'value' property
      if (typeof config === 'object' && 'value' in config) {
        const value = config.value; // No need for type assertion now since we're dynamically checking

        // Log the extracted key and value
        this.logger.log(`Extracted key: ${key}, value: ${value}`);

        // Send success response
        res.status(HttpStatus.OK).json({
          message: 'Configuration updated successfully',
          extractedKey: key,
          extractedValue: value,
        });
      } else {
        throw new HttpException(
          'Invalid structure in items: missing key or value',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      this.logger.error('Error in configuration update', error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
