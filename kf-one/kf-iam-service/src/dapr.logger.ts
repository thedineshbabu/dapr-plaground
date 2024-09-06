import { Logger } from '@nestjs/common';
import { LoggerService } from '@dapr/dapr';

export class DaprLogger implements LoggerService {
  private readonly logger = new Logger(DaprLogger.name);

  constructor() {}

  error(message: any, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]): void {
    this.logger.log(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    this.logger.verbose(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }
}
