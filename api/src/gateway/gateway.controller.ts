import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { CreateDeviceDto } from '../device/dto/create-device.dto';
import { isIPv4 } from 'net';

@Controller('api/v1/gateways')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  create(@Body() createGatewayDto: CreateGatewayDto) {
    const ip = createGatewayDto.IPv4;
    if (!isIPv4(ip))
      throw new BadRequestException({ message: 'Invalid IP v4 inserted' });
    return this.gatewayService.create(createGatewayDto);
  }

  @Get()
  async findAll() {
    const gateways = await this.gatewayService.findAll();
    const totalGateways = await this.gatewayService.totalGateways();
    return {
      total: totalGateways,
      gateways,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gatewayService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGatewayDto: UpdateGatewayDto,
  ) {
    return await this.gatewayService.update(id, updateGatewayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gatewayService.remove(id);
  }

  @Post(':id/devices')
  addDeviceToGateway(
    @Param('id') id: string,
    @Body() createDeviceDTO: CreateDeviceDto,
  ) {
    return this.gatewayService.addDeviceToGateway(id, createDeviceDTO);
  }

  @Patch(':gatewayId/devices/:deviceId')
  connectDeviceToGateway(
    @Param('gatewayId') gatewayId: string,
    @Param('deviceId') deviceId: string,
  ) {
    return this.gatewayService.connectDeviceToGateway(gatewayId, deviceId);
  }

  @Delete(':gatewayId/devices/:deviceId')
  removeDeviceFromGateway(
    @Param('gatewayId') gatewayId: string,
    @Param('deviceId') deviceId: string,
  ) {
    return this.gatewayService.removeDeviceFromGateway(gatewayId, deviceId);
  }
}
