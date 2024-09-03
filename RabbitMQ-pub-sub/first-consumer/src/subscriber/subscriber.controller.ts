// // src/subscriber/subscriber.controller.ts
// import { Controller, Post, Body, Get, Res, Req } from '@nestjs/common';
// import { SubscriberService } from './subscriber.service';
// import { Response } from 'express';

// @Controller('dapr/subscribe')
// export class SubscriberController {
//   constructor(private readonly subscriberService: SubscriberService) {}

//   @Get()
//   getHello(): any {
//     return [
//       {
//         pubsubname: 'cpubsub',
//         topic: 'organizations',
//         route: 'dapr/subscribe/organizations',
//       },
//     ];
//   }

//   @Post('organizations')
//   handleRabbitMQMessage(@Req() req: Request, @Res() res: Response) {
//     // handleRabbitMQMessage(@Body() data: any) {
//     try {
//       console.log('Reached here');
//       console.log(JSON.stringify(req.body));
//       // console.log(res);
//       // this.subscriberService.handleMessage(data);
//       return { status: 'ok' };
//     } catch (e) {
//       console.log(e);
//       return { status: 'error' };
//     }
//   }
// }
