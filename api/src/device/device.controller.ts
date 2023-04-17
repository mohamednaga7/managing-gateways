import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('api/v1/devices')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly gatewayService: GatewayService,
  ) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Get()
  async findAll() {
    const devices = await this.deviceService.findAll();
    const count = await this.deviceService.totalDevices();
    return {
      total: count,
      devices,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const device = await this.deviceService.remove(id);
    if (device) {
      const gateways = await this.gatewayService.findGatewayContainingDevice(
        id,
      );
      await Promise.all(
        gateways.map((gateway) =>
          this.gatewayService.removeDeviceFromGateway(
            gateway._id.toString(),
            id,
          ),
        ),
      );
    }
    return true;
  }
}
