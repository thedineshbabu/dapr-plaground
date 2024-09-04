import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios'; // Import the 'axios' module
import * as http from 'http'; // Import the 'http' module

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  DAPR_HOST = process.env.DAPR_HOST || 'http://localhost';
  daprPort = process.env.DAPR_HTTP_PORT || '3500';
  pubsubEndpoint = `http://localhost:${this.daprPort}/v1.0/publish/cpubsub/kfone`;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('organizations')
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
        console.log('Parsed Body:', parsedBody.data);
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }

      return res.sendStatus(200);
    });
  }

  @Post('employees')
  createEmployee(@Req() req: any, @Res() res: any): any {
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
        console.log('Parsed Body:', parsedBody.data);
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }

      return res.sendStatus(200);
    });
  }

  @Post('publish')
  publishMessage(@Req() req: any, @Res() res: any): any {
    console.log('publishing', req.body);
    // console.log();
    axios
      .post(this.pubsubEndpoint, req.body, {
        headers: {
          'content-type': 'application/cloudevents+json',
        },
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        res.sendStatus(500);
        console.error('There was an error!', error);
      });
    return 1;
  }

  @Post('call2ndService')
  async get2ndService(@Body() body: any): Promise<any> {
    console.log('First Consumer received: ' + JSON.stringify(body));
    console.log('DAPR Host: ' + this.DAPR_HOST);
    console.log('DAPR Port: ' + this.daprPort);
    // const axiosConfig = {
    //   headers: {
    //     'dapr-app-id': 'secondconsumer',
    //   },
    // };

    for (let i = 1; i <= 1; i++) {
      await sleep(1000);

      const order = { orderId: i };
      console.log('Order passed: ' + JSON.stringify(order));

      // Invoking a service
      // const res = await axios.post(
      //   `${this.DAPR_HOST}:${this.daprPort}/listen`,
      //   order,
      //   axiosConfig,
      // );

      // const res = await axios.post(
      //   'http://localhost:3501/listen',
      //   order,
      //   axiosConfig,
      // );
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.DAPR_HOST}:${this.daprPort}/listen`,
        headers: {
          'dapr-app-id': 'second-consumer',
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      // console.log('Order passed: ' + res.config.data);
    }

    return 1;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
