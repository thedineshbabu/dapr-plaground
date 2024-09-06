import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
// import { NestExpressApplication } from '@nestjs/platform-express';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly daprHost = process.env.DAPR_HOST ?? 'localhost';
  private readonly daprPort = process.env.DAPR_HTTP_PORT ?? 3510;
  private readonly appPort = process.env.APP_PORT ?? 3310;
  private readonly daprConfigurationStore = 'configstore';
  private readonly baseUrl = `http://${this.daprHost}:${this.daprPort}/v1.0/configuration/${this.daprConfigurationStore}`;
  private readonly configurationItems = [
    'app.timeout',
    'app.retries',
    'db.max_connections',
    'feature.new_ui',
  ];

  constructor(
    private readonly httpService: HttpService,
    // private readonly app: NestExpressApplication, // Inject the Nest application instance
  ) {}

  async main() {
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
          `${this.baseUrl}/subscribe?metadata.pgNotifyChannel=config`,
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
