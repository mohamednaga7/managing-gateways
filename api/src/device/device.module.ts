import { forwardRef, Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceSchema } from './entities/device.entity';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }]), forwardRef(() => GatewayModule)],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule { }
