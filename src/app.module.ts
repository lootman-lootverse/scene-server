import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { SceneModule } from './scene/scene.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ConfigVariables } from './config/config.interface';
import { BullModule } from '@nestjs/bull';
import { Web3Module } from './web3/web3.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const variables =
          configService.get<ConfigVariables['database']>('database').mysql;
        return {
          type: 'mysql',
          host: variables.host,
          port: variables.port,
          username: variables.user,
          password: variables.password,
          database: variables.database,
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('bull.redis.host'),
            port: configService.get('bull.redis.port'),
          },
        };
      },
    }),
    SceneModule,
    Web3Module,
    IpfsModule,
  ],
  controllers: [],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
