import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GatewayService } from 'src/gateway/gateway.service';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('v1/api/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService, private readonly gatewayService: GatewayService) { }

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Get()
  findAll() {
    return this.deviceService.findAll();
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
      const gateways = await this.gatewayService.findGatewayContainingDevice(id);
      await Promise.all(gateways.map((gateway) => this.gatewayService.removeDeviceFromGateway(gateway._id.toString(), id)))
    }
    return true;
  }
}
