import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel('Device') private readonly deviceModel: Model<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const foundDevice = await this.deviceModel.findOne({
      UID: createDeviceDto.UID,
    });
    if (foundDevice)
      throw new BadRequestException({
        message: 'a device with the same UID already exists',
      });

    const createdDevice = await this.deviceModel.create({
      ...createDeviceDto,
      status: 'ONLINE',
    });

    return createdDevice.toObject();
  }

  findAll(): Promise<Device[]> {
    return this.deviceModel.find();
  }

  async totalDevices() {
    return await this.deviceModel.count();
  }

  async findOne(id: string) {
    const device = await this.deviceModel.findById(id);
    if (!device) throw new NotFoundException({ message: 'Device not found' });
    return device;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const foundDevice = await this.deviceModel.findById(id);
    if (!foundDevice)
      throw new NotFoundException({ message: 'Device not found' });

    return await this.deviceModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...updateDeviceDto },
      { new: true },
    );
  }

  async remove(id: string) {
    const foundDevice = await this.deviceModel.findById(id);
    if (!foundDevice)
      throw new NotFoundException({ message: 'Device not found' });

    await this.deviceModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    return foundDevice;
  }
}
