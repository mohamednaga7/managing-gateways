import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DeviceService } from 'src/device/device.service';
import { CreateDeviceDto } from 'src/device/dto/create-device.dto';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { Gateway } from './entities/gateway.entity';

@Injectable()
export class GatewayService {

  constructor(@InjectModel('Gateway') private readonly gatewayModel: Model<Gateway>, private readonly deviceService: DeviceService) { }

  async create(createGatewayDto: CreateGatewayDto) {
    const foundGateway = await this.gatewayModel.findOne({ serial: createGatewayDto.serial })
    if (foundGateway) throw new BadRequestException({ message: 'a gateway with the same serial already exists' })

    const newGateway = await this.gatewayModel.create({
      ...createGatewayDto
    })
    return newGateway
  }

  async findAll() {
    return await this.gatewayModel.find().lean();
  }

  async findOne(id: string) {
    const gateway = await this.gatewayModel.findById(id).populate('devices').lean();
    if (!gateway) throw new NotFoundException({ message: 'Gateway not found' })
    return gateway;
  }

  async update(id: string, updateGatewayDto: UpdateGatewayDto): Promise<Gateway> {
    const foundGateway = await this.gatewayModel.findById(id);
    if (!foundGateway) throw new NotFoundException({ message: 'No gateway found with this id' })


    if (updateGatewayDto.serial !== undefined && foundGateway.serial !== updateGatewayDto.serial) {
      const sameSerialFound = await this.gatewayModel.findOne({ serial: updateGatewayDto.serial })
      if (sameSerialFound) throw new BadRequestException({ message: 'a gateway with the same serial already exists' })
    }

    const updatedModel = await this.gatewayModel.updateOne({ _id: new mongoose.Types.ObjectId(id) }, {
      ...updateGatewayDto
    }, { new: true }).lean()

    return updatedModel;
  }

  async remove(id: string) {
    const foundGateway = await this.gatewayModel.findById(id);
    if (!foundGateway) throw new NotFoundException({ message: 'No gateway found with this id' })

    await this.gatewayModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    return true;
  }

  async addDeviceToGateway(gatewayId: string, device: CreateDeviceDto) {
    const gateway = await this.findOne(gatewayId)

    if (gateway.devices.length >= 10) throw new BadRequestException({ message: 'Gateway devices limit reached' })

    const newDevice = await this.deviceService.create(device);

    if (!newDevice) throw new BadRequestException({ message: 'Error creating device' })

    const updatedGateway = await this.gatewayModel.updateOne({ _id: gateway._id }, {
      $push: { devices: newDevice._id }
    })

    if (!updatedGateway) throw new BadRequestException({ message: 'Error adding device to gateway' })

    return newDevice;
  }

  async connectDeviceToGateway(gatewayId: string, deviceId: string) {
    const gateway = await this.findOne(gatewayId);
    const device = await this.deviceService.findOne(deviceId)

    const foundDeviceInGatewayDevices = gateway.devices.find((d) => d._id.toString() === device._id.toString())
    if (foundDeviceInGatewayDevices) return device;

    const updatedGateway = await this.gatewayModel.updateOne({ _id: gateway._id }, {
      $push: { devices: device._id }
    })

    if (!updatedGateway) throw new BadRequestException({ message: 'Error adding device to gateway' })

    return device;
  }

  async removeDeviceFromGateway(gatewayId: string, deviceId: string) {
    const gateway = await this.findOne(gatewayId);

    const updatedGateway = await this.gatewayModel.updateOne({ _id: gateway._id }, {
      $pull: { devices: new mongoose.Types.ObjectId(deviceId) }
    })

    if (!updatedGateway) throw new BadRequestException({ message: 'Error removing device from gateway' })
  }

  async findGatewayContainingDevice(deviceId: string) {
    return await this.gatewayModel.find({ devices: new mongoose.Types.ObjectId(deviceId) }).lean();
  }
}
