import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {


  constructor(@InjectModel('Device') private readonly deviceModel: Model<Device>) { }

  async create(createDeviceDto: CreateDeviceDto) {
    return await this.deviceModel.create({ ...createDeviceDto, status: 'ONLINE' })
  }

  async findAll() {
    return await this.deviceModel.find().lean();
  }

  async findOne(id: string) {
    const device = await this.deviceModel.findById(id).lean();
    if (!device) throw new NotFoundException({ message: 'Device not found' })
    return device;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const foundDevice = await this.deviceModel.findById(id);
    if (!foundDevice) throw new NotFoundException({ message: 'Device not found' })

    const updatedDevice = await this.deviceModel.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { ...updateDeviceDto }, { new: true }).lean()
    return updatedDevice;
  }

  async remove(id: string) {
    const foundDevice = await this.deviceModel.findById(id);
    if (!foundDevice) throw new NotFoundException({ message: 'Device not found' })

    await this.deviceModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
    return foundDevice;
  }
}
