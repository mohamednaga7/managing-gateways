import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateDeviceDto } from './dto/update-device.dto';

describe('DeviceService', () => {
  let service: DeviceService;
  let module: TestingModule;
  let deviceModel: Model<Device>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getModelToken('Device'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            findById: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
    deviceModel = module.get<Model<Device>>(getModelToken('Device'));
  });

  afterEach(async () => {
    await module.close();
  });

  describe('create', () => {
    it('should create a new device', async () => {
      const createDeviceDto: CreateDeviceDto = {
        UID: '123456',
        vendor: 'vendor',
      };
      const expectedDevice = {
        _id: '123',
        UID: '123456',
        status: 'ONLINE',
        vendor: 'vendor',
        createdAt: new Date(),
      };

      jest.spyOn(deviceModel, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(deviceModel, 'create').mockResolvedValueOnce({
        toObject: jest.fn().mockReturnValueOnce(expectedDevice),
      } as any);

      const result = await service.create(createDeviceDto);

      expect(deviceModel.findOne).toHaveBeenCalledWith({
        UID: createDeviceDto.UID,
      });
      expect(deviceModel.create).toHaveBeenCalledWith({
        ...createDeviceDto,
        status: 'ONLINE',
      });
      expect(result).toEqual(expectedDevice);
    });

    it('should throw a BadRequestException if a device with the same UID already exists', async () => {
      const createDeviceDto: CreateDeviceDto = {
        UID: '123456',
        vendor: 'vendor',
      };
      jest.spyOn(deviceModel, 'findOne').mockReturnValueOnce({} as any);

      await expect(service.create(createDeviceDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all devices', async () => {
      const expectedDevices = [
        { id: '1', name: 'Device 1', UID: 'uid1', status: 'ONLINE' },
        { id: '2', name: 'Device 2', UID: 'uid2', status: 'OFFLINE' },
      ];
      jest.spyOn(deviceModel, 'find').mockResolvedValueOnce(expectedDevices);

      const devices = await service.findAll();

      expect(devices).toEqual(expectedDevices);
      expect(deviceModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('totalDevices', () => {
    it('should return the total number of devices', async () => {
      const expectedCount = 10;
      jest.spyOn(deviceModel, 'count').mockResolvedValueOnce(expectedCount);

      const count = await service.totalDevices();

      expect(count).toBe(expectedCount);
      expect(deviceModel.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a device', async () => {
      const expectedDevice = {
        id: '1',
        name: 'Device 1',
        UID: 'uid1',
        status: 'ONLINE',
      };
      jest.spyOn(deviceModel, 'findById').mockResolvedValueOnce(expectedDevice);

      const device = await service.findOne('1');

      expect(device).toEqual(expectedDevice);
      expect(deviceModel.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if the device does not exist', async () => {
      jest.spyOn(deviceModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a device', async () => {
      const updateDeviceDto: UpdateDeviceDto = {
        status: 'OFFLINE',
      };
      const expectedDevice = {
        id: '643cb843c4a33a6cc58c26b1',
        name: 'Device 1',
        UID: 'uid1',
        status: 'ONLINE',
      };
      jest.spyOn(deviceModel, 'findById').mockResolvedValueOnce(expectedDevice);
      jest.spyOn(deviceModel, 'updateOne').mockResolvedValueOnce({
        ...expectedDevice,
        status: updateDeviceDto.status,
      } as any);

      const device = await service.update(
        '643cb843c4a33a6cc58c26b1',
        updateDeviceDto,
      );

      expect(device).toEqual({
        ...expectedDevice,
        status: updateDeviceDto.status,
      });
      expect(deviceModel.findById).toHaveBeenCalledTimes(1);
      expect(deviceModel.updateOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if the device does not exist', async () => {
      const updateDeviceDto = {
        name: 'Device 1',
        status: 'ONLINE',
      };
      jest.spyOn(deviceModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.update('1', updateDeviceDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a device', async () => {
      const expectedDevice = {
        id: '643cb843c4a33a6cc58c26b1',
        name: 'Device 1',
        UID: 'uid1',
        status: 'ONLINE',
      };
      jest.spyOn(deviceModel, 'findById').mockResolvedValueOnce(expectedDevice);
      jest.spyOn(deviceModel, 'deleteOne').mockResolvedValueOnce({} as any);

      const device = await service.remove('643cb843c4a33a6cc58c26b1');

      expect(device).toEqual(expectedDevice);
      expect(deviceModel.findById).toHaveBeenCalledTimes(1);
      expect(deviceModel.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if the device does not exist', async () => {
      jest.spyOn(deviceModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
