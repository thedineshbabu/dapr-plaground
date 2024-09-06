import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DaprClient, CommunicationProtocolEnum, LogLevel } from '@dapr/dapr';
import { DaprLogger } from './dapr.logger';

@Injectable()
export class DaprService {
  daprClient: DaprClient;
  private readonly logger = new Logger(DaprService.name);

  constructor(private readonly configService: ConfigService) {
    const daprHost = this.configService.get<string>('DAPR_HOST') ?? 'localhost';
    const daprPort = this.configService.get<string>('DAPR_HTTP_PORT');

    console.log(`daprhost: ${daprHost}`);
    console.log(`daprport: ${daprPort}`);

    this.logger.log(`Initializing DaprClient("${daprHost}", ${daprPort})`);
    this.daprClient = new DaprClient({
      daprHost,
      daprPort,
      communicationProtocol: CommunicationProtocolEnum.HTTP,
      logger: {
        level: LogLevel.Verbose,
        service: new DaprLogger(),
      },
    });
  }
}
