import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AppConfig')
@Controller('configuration/configstore')
export class ConfigController {
  private readonly logger = new Logger(ConfigController.name);

  @Post('*')
  handleConfigUpdate(@Body() body: any, @Res() res: Response) {
    this.logger.log(
      `Received configuration update: ${JSON.stringify(body.items)}`,
    );
    res.sendStatus(200);
  }
}
