import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);
  private readonly daprHost = this.configService.get<string>('DAPR_HOST');
  private readonly daprPort = this.configService.get<string>('DAPR_HTTP_PORT');
  private readonly appPort = this.configService.get<string>('APP_PORT');
  // private readonly configurationItems: string[] =
  //   this.configService.get<string[]>('CONFIG_ITEMS');
  private readonly daprConfigurationStore =
    this.configService.get<string>('CONFIG_STORE_NAME');
  private readonly baseUrl = `${this.daprHost}:${this.daprPort}/v1.0/configuration/${this.daprConfigurationStore}`;
  private readonly configurationItems = ['kf1topicname', 'kf1pubsubname'];

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    // private readonly app: NestExpressApplication, // Inject the Nest application instance
  ) {}

  async main() {
    this.logger.log(`DaprHost: ${this.daprHost}`);
    this.logger.log(`DaprPort: ${this.daprPort}`);
    this.logger.log(`AppPort: ${this.appPort}`);
    this.logger.log(`DaprConfigurationStore: ${this.daprConfigurationStore}`);
    this.logger.log(`BaseUrl: ${this.baseUrl}`);
    this.logger.log(`ConfigurationItems: ${this.configurationItems}`);

    // Get config items from the config store
    await Promise.all(
      this.configurationItems.map(async (item) => {
        try {
          const response: AxiosResponse = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}?key=${item}`),
          );
          this.logger.log(
            `Configuration for ${item}: ${JSON.stringify(response.data)}`,
          );
        } catch (error) {
          this.logger.error(`Could not get config item, err: ${error}`);
        }
      }),
    );

    // Start server to receive config updates
    this.startServerToReceiveConfigUpdates();

    // Subscribe to config updates
    const subscriptionId = await this.subscribeToConfigUpdates();
    this.logger.log(`SubscriptionId: ${subscriptionId}`);

    // Unsubscribe after 20 seconds
    // setTimeout(async () => {
    //   await this.unsubscribeToConfigUpdates(subscriptionId);
    // }, 20000);
  }

  private async subscribeToConfigUpdates() {
    await this.sleep(3000); // Wait for the Dapr app to be ready
    try {
      //curl -l 'http://<host>:<dapr-http-port>/configuration/mypostgresql/subscribe?key=<keyname1>&key=<keyname2>&metadata.pgNotifyChannel=<channel name>'

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/subscribe?metadata.pgNotifyChannel=config&metadata.sentinelkey=kfSentinelKey`,
        ),
      );
      this.logger.log(
        `Subscribed to config updates with subscription id: ${response.data.id}`,
      );
      return response.data.id;
    } catch (error) {
      this.logger.error(`Could not subscribe to config updates: ${error}`);
      throw new Error(`Subscription failed`);
    }
  }

  // private async unsubscribeToConfigUpdates(subscriptionId: string) {
  //   try {
  //     const response: AxiosResponse = await firstValueFrom(
  //       this.httpService.get(`${this.baseUrl}/${subscriptionId}/unsubscribe`),
  //     );
  //     if (JSON.stringify(response.data).includes('true')) {
  //       this.logger.log('Unsubscribed from config updates');
  //     } else {
  //       this.logger.error(
  //         `Error unsubscribing from config updates: ${response.data}`,
  //       );
  //     }
  //   } catch (error) {
  //     this.logger.error(`Error unsubscribing from config updates: ${error}`);
  //   }
  // }

  private startServerToReceiveConfigUpdates() {
    this.logger.log(`App listening for config updates on port ${this.appPort}`);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
