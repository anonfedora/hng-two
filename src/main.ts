import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
        .setTitle("HNG Authorisation and Organzation")
        .setDescription(
            "API Documentation with Auth, Authorisation, and Organzation"
        )
        .setVersion("1.0").addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access_token', // This name here is to be used in @ApiBearerAuth() decorator
    )
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document);
  await app.listen(3000);
}
bootstrap();
