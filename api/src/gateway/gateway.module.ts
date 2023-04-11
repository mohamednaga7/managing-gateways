import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewaySchema } from './entities/gateway.entity';
import { DeviceModule } from 'src/device/device.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Gateway', schema: GatewaySchema }]), DeviceModule],
  controllers: [GatewayController],
  providers: [GatewayService]
})
export class GatewayModule { }
