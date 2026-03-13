import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { pipesErrorMessageFormatter } from './common/utils/pipes-error-message-formatter.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => pipesErrorMessageFormatter(errors),
    }),
  );
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Social app')
    .setDescription('The social app API description')
    .setVersion('1.0')
    .addTag('Social app')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('port')!);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
