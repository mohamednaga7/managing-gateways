import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { DeviceModule } from './device/device.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        MONGO_DB_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
      ignoreEnvFile: !!(
        process.env.NODE_ENV && process.env.NODE_ENV === 'production'
      ),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get<string>('MONGO_DB_URL'),
        };
      },
    }),
    DeviceModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
