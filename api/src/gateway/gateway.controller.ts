import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { CreateDeviceDto } from 'src/device/dto/create-device.dto';

@Controller('v1/api/gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) { }

  @Post()
  create(@Body() createGatewayDto: CreateGatewayDto) {
    return this.gatewayService.create(createGatewayDto);
  }

  @Get()
  findAll() {
    return this.gatewayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gatewayService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGatewayDto: UpdateGatewayDto) {
    return this.gatewayService.update(id, updateGatewayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gatewayService.remove(id);
  }

  @Post(':id/devices')
  addDeviceToGateway(@Param('id') id: string, @Body() createDeviceDTO: CreateDeviceDto) {
    return this.gatewayService.addDeviceToGateway(id, createDeviceDTO)
  }

  @Patch(':gatewayId/devices/:deviceId')
  connectDeviceToGateway(@Param('gatewayId') gatewayId: string, @Param('deviceId') deviceId: string) {
    return this.gatewayService.connectDeviceToGateway(gatewayId, deviceId)
  }

  @Delete(':gatewayId/devices/:deviceId')
  removeDeviceFromGateway(@Param('gatewayId') gatewayId: string, @Param('deviceId') deviceId: string) {
    return this.gatewayService.removeDeviceFromGateway(gatewayId, deviceId)
  }
}
