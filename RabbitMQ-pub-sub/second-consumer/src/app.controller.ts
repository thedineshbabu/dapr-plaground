import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as http from 'http'; // Add this line to import the 'http' module

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('employees')
  createEmployee(@Req() req: any, @Res() res: any): any {
    const chunks: any[] = [];

    (req as http.IncomingMessage).on('data', (chunk) => {
      chunks.push(chunk);
    });

    (req as http.IncomingMessage).on('end', () => {
      const buffer = Buffer.concat(chunks);
      console.log('Raw Buffer:', buffer);

      // If you want to convert the buffer to a string:
      const rawBody = buffer.toString('utf8');
      console.log('Raw Body:', rawBody);

      // If the body is JSON, you can parse it:
      let parsedBody;
      try {
        parsedBody = JSON.parse(rawBody);
        console.log('Parsed Body:', parsedBody);
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }

      return res.sendStatus(200);
    });
  }

  @Post('listen')
  listen(@Req() req: any, @Res() res: any): any {
    // const chunks: any[] = [];

    // (req as http.IncomingMessage).on('data', (chunk) => {
    //   chunks.push(chunk);
    // });

    // (req as http.IncomingMessage).on('end', () => {
    //   const buffer = Buffer.concat(chunks);
    //   console.log('Raw Buffer:', buffer);

    //   // If you want to convert the buffer to a string:
    //   const rawBody = buffer.toString('utf8');
    //   console.log('Raw Body:', rawBody);

    //   // If the body is JSON, you can parse it:
    //   let parsedBody;
    //   try {
    //     parsedBody = JSON.parse(rawBody);
    //     console.log('Parsed Body:', parsedBody);
    //   } catch (err) {
    //     console.error('Error parsing JSON:', err);
    //   }

    //   return res.sendStatus(200);
    // });
    console.log('Received request:', req.body);
    return res.sendStatus(200);
  }
}
