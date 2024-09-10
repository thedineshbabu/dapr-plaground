import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ConfigurationService } from './configuration.service';

async function bootstrap() {
  const appPort = process.env.APP_PORT ?? 8081;
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigurationService);
  // await configService.main();
  const config = new DocumentBuilder()
    .setTitle('Service 1 Documentation')
    .setDescription('The Service 1 description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  console.log(`Starting app on port ${appPort}`);
  await app.listen(appPort);
}
bootstrap();
