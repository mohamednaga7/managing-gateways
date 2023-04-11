import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [MongooseModule.forRoot(
    "mongodb+srv://m7mdnaga7:mGGvySBCOmN8RJr7@dev-cluster.ahcdga9.mongodb.net/?retryWrites=true&w=majority"
  ), DeviceModule, GatewayModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
