import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigVariables } from './config/config.interface';
import { FileLogger } from './utils/file-logger';

const logger = new Logger('main');

async function setupOpenAPI(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('FindTruman Scenes')
    .setDescription(
      '所有接口的返回将会被包含在返回结构中{data, code, msg}, 文档中将直接显示data字段的数据定义',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const url = 'api-doc';
  SwaggerModule.setup(url, app, document);
  logger.log(`OpenAPI setup at '${url}'`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  const openapiConfig =
    configService.get<ConfigVariables['openapi']>('openapi');
  if (openapiConfig) {
    setupOpenAPI(app);
  }

  const loggerConfig = configService.get<ConfigVariables['logger']>('logger');
  app.useLogger(new FileLogger(loggerConfig));

  const port = configService.get<number>('port');
  logger.log(`server run on port ${port}`);
  await app.listen(port);
}
bootstrap();
