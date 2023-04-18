import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from './gateway.service';
import { getModelToken } from '@nestjs/mongoose';
import { DeviceService } from '../device/device.service';
import * as mongoose from 'mongoose';
import { Gateway } from './entities/gateway.entity';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { CreateDeviceDto } from 'src/device/dto/create-device.dto';
import { Device } from 'src/device/entities/device.entity';

describe('GatewayService', () => {
  let service: GatewayService;
  let gatewayModel: mongoose.Model<Gateway>;
  let deviceService: DeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        {
          provide: getModelToken('Gateway'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            count: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: DeviceService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<GatewayService>(GatewayService);
    gatewayModel = module.get<mongoose.Model<Gateway>>(
      getModelToken('Gateway'),
    );
    deviceService = module.get<DeviceService>(DeviceService);
  });

  describe('create', () => {
    it('should create a new gateway', async () => {
      const createGatewayDto: CreateGatewayDto = {
        name: 'Test Gateway',
        serial: '123456',
        IPv4: '192.168.1.1',
      };
      const mockGateway = {
        _id: '6047c547ba6f49053c358fa0',
        name: 'Test Gateway',
        serial: '123456',
        ipAddress: '192.168.1.1',
      };
      jest.spyOn(gatewayModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(gatewayModel, 'create').mockResolvedValue(mockGateway as any);

      const result = await service.create(createGatewayDto);

      expect(gatewayModel.findOne).toHaveBeenCalledWith({
        serial: createGatewayDto.serial,
      });
      expect(gatewayModel.create).toHaveBeenCalledWith(createGatewayDto);
      expect(result).toEqual(mockGateway);
    });

    it('should throw BadRequestException if gateway with same serial already exists', async () => {
      const createGatewayDto: CreateGatewayDto = {
        name: 'Test Gateway',
        serial: '123456',
        IPv4: '192.168.1.1',
      };
      const mockGateway = {
        _id: '6047c547ba6f49053c358fa0',
        name: 'Test Gateway',
        serial: '123456',
        ipAddress: '192.168.1.1',
      };
      jest.spyOn(gatewayModel, 'findOne').mockResolvedValue(mockGateway);

      await expect(service.create(createGatewayDto)).rejects.toThrowError(
        new BadRequestException({
          message: 'a gateway with the same serial already exists',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of gateways', async () => {
      const expectedGateways = [
        { id: '1', name: 'Gateway 1' },
        { id: '2', name: 'Gateway 2' },
      ];

      jest.spyOn(gatewayModel, 'find').mockResolvedValue(expectedGateways);

      const result = await service.findAll();

      expect(result).toEqual(expectedGateways);
      expect(gatewayModel.find).toHaveBeenCalledTimes(1);
      expect(gatewayModel.find).toHaveBeenCalledWith();
    });
  });

  describe('totalGateways', () => {
    it('should return the total number of gateways', async () => {
      const expectedTotal = 2;

      jest.spyOn(gatewayModel, 'count').mockResolvedValue(expectedTotal);

      const result = await service.totalGateways();

      expect(result).toEqual(expectedTotal);
      expect(gatewayModel.count).toHaveBeenCalledTimes(1);
      expect(gatewayModel.count).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a gateway', async () => {
      const expectedGateway = {
        _id: '6047c547ba6f49053c358fa0',
        name: 'Test Gateway',
        serial: '123456',
        ipAddress: '192.168.0.1',
        devices: [],
      };
      jest.spyOn(gatewayModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({ lean: () => expectedGateway }),
          } as any),
      );

      const result = await service.findOne(expectedGateway._id);

      expect(gatewayModel.findById).toHaveBeenCalledWith(expectedGateway._id);
      expect(gatewayModel.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedGateway);
    });

    it('should throw NotFoundException if gateway is not found', async () => {
      const invalidId = 'invalid-id';
      gatewayModel.findById = jest.fn().mockImplementation(() => ({
        populate: () => ({ lean: () => null }),
      }));

      await expect(service.findOne(invalidId)).rejects.toThrowError(
        NotFoundException,
      );
      expect(gatewayModel.findById).toHaveBeenCalledWith(invalidId);
      expect(gatewayModel.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update gateway successfully', async () => {
      const id = '609aa90719b7ba9d1c71e728';
      const updateGatewayDto: UpdateGatewayDto = {
        name: 'New Gateway Name',
      };

      const gateway = {
        _id: id,
        name: 'Gateway Name',
        ipv4: '192.168.0.1',
        serial: 'serial-1',
        devices: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(gatewayModel, 'findById').mockResolvedValueOnce(gateway);
      jest.spyOn(gatewayModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(gatewayModel, 'updateOne').mockResolvedValueOnce({
        ...gateway,
        name: updateGatewayDto.name,
      } as any);

      const result = await service.update(id, updateGatewayDto);

      expect(result).toEqual({ ...gateway, name: updateGatewayDto.name });
      expect(gatewayModel.findById).toHaveBeenCalledWith(id);
      expect(gatewayModel.updateOne).toHaveBeenCalledWith(
        { _id: new mongoose.Types.ObjectId(id) },
        updateGatewayDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if gateway is not found', async () => {
      const id = '609aa90719b7ba9d1c71e728';
      const updateGatewayDto: UpdateGatewayDto = {
        name: 'New Gateway Name',
        IPv4: '192.168.1.1',
      };

      jest.spyOn(gatewayModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.update(id, updateGatewayDto)).rejects.toThrow(
        new NotFoundException({ message: 'No gateway found with this id' }),
      );
    });

    it('should throw BadRequestException if gateway with same serial already exists', async () => {
      const id = '609aa90719b7ba9d1c71e728';
      const updateGatewayDto: UpdateGatewayDto = {
        name: 'New Gateway Name',
        IPv4: '192.168.1.1',
        serial: 'serial-2',
      };

      const gateway = {
        _id: '609aa90719b7ba9d1c71e729',
        name: 'Gateway Name',
        ipv4: '192.168.0.1',
        serial: 'serial-1',
        devices: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(gatewayModel, 'findById').mockResolvedValueOnce(gateway);
      jest.spyOn(gatewayModel, 'findOne').mockResolvedValueOnce({
        ...gateway,
        _id: id,
      });

      await expect(service.update(id, updateGatewayDto)).rejects.toThrow(
        new BadRequestException({
          message: 'a gateway with the same serial already exists',
        }),
      );

      expect(gatewayModel.findById).toHaveBeenCalledWith(id);
      expect(gatewayModel.findOne).toHaveBeenCalledWith({
        serial: updateGatewayDto.serial,
      });

      expect(gatewayModel.updateOne).not.toHaveBeenCalled();
    });
  });

  it('should remove gateway with valid id', async () => {
    const gatewayId = '123456789012345678901234';
    const foundGateway: Gateway = {
      _id: gatewayId,
      name: 'Test Gateway',
      IPv4: '192.168.0.1',
      serial: '123456',
      devices: [],
    };
    jest.spyOn(gatewayModel, 'findById').mockResolvedValue(foundGateway);
    jest.spyOn(gatewayModel, 'deleteOne').mockResolvedValue({} as any);

    const result = await service.remove(gatewayId);

    expect(gatewayModel.findById).toHaveBeenCalledWith(gatewayId);
    expect(gatewayModel.deleteOne).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId(gatewayId),
    });
    expect(result).toBe(true);
  });

  it('should throw NotFoundException when no gateway found with given id', async () => {
    const gatewayId = '123456789012345678901234';
    jest.spyOn(gatewayModel, 'findById').mockResolvedValue(null);

    await expect(service.remove(gatewayId)).rejects.toThrowError(
      new NotFoundException({ message: 'No gateway found with this id' }),
    );

    expect(gatewayModel.findById).toHaveBeenCalledWith(gatewayId);
    expect(gatewayModel.deleteOne).not.toHaveBeenCalled();
  });

  describe('addDeviceToGateway', () => {
    it('should add a device to a gateway and return the new device', async () => {
      const gatewayId = '60e29c04e074b710f0e99232';
      const createDeviceDto: CreateDeviceDto = {
        UID: '12345',
        vendor: 'Vendor name',
      };

      const mockGateway = {
        _id: gatewayId,
        name: 'Test Gateway',
        serial: '12345',
        ipv4: '192.168.0.1',
        devices: [],
      };

      const mockNewDevice = {
        _id: '60e29c13e074b710f0e99233',
        uid: createDeviceDto.UID,
        vendor: createDeviceDto.vendor,
        status: 'ONLINE',
      };

      jest.spyOn(gatewayModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              lean: () => mockGateway,
            }),
          } as any),
      );
      jest
        .spyOn(deviceService, 'create')
        .mockResolvedValue(mockNewDevice as any);

      jest
        .spyOn(gatewayModel, 'updateOne')
        .mockResolvedValue(mockGateway as any);

      const result = await service.addDeviceToGateway(
        gatewayId,
        createDeviceDto,
      );

      expect(gatewayModel.findById).toHaveBeenCalledWith(gatewayId);
      expect(deviceService.create).toHaveBeenCalledWith(createDeviceDto);
      expect(gatewayModel.updateOne).toHaveBeenCalledWith(
        { _id: mockGateway._id },
        { $push: { devices: mockNewDevice._id } },
      );
      expect(result).toEqual(mockNewDevice);
    });

    it('should throw an error if the gateway devices limit has been reached', async () => {
      const gatewayId = '60e29c04e074b710f0e99232';
      const createDeviceDto: CreateDeviceDto = {
        UID: '12345',
        vendor: 'Vendor name',
      };

      const mockGateway = {
        _id: gatewayId,
        name: 'Test Gateway',
        serial: '12345',
        ipv4: '192.168.0.1',
        devices: new Array(10).fill('60e29c13e074b710f0e99233'),
      };

      jest.spyOn(gatewayModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              lean: () => mockGateway,
            }),
          } as any),
      );

      await expect(
        service.addDeviceToGateway(gatewayId, createDeviceDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('connectDeviceToGateway', () => {
    it('should throw NotFoundException if gateway is not found', async () => {
      const gatewayId = 'fake-id';
      const deviceId = 'fake-id';

      jest.spyOn(gatewayModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({ lean: () => null }),
          } as any),
      );

      jest.spyOn(deviceService, 'findOne').mockResolvedValueOnce({} as any);

      await expect(
        service.connectDeviceToGateway(gatewayId, deviceId),
      ).rejects.toThrowError(NotFoundException);
      expect(gatewayModel.findById).toHaveBeenCalledWith(gatewayId);
    });

    it('should throw NotFoundException if device is not found', async () => {
      const gatewayId = 'fake-id';
      const deviceId = 'fake-id';

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce({ devices: [] } as any);
      jest.spyOn(deviceService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.connectDeviceToGateway(gatewayId, deviceId),
      ).rejects.toThrowError(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(gatewayId);
      expect(deviceService.findOne).toHaveBeenCalledWith(deviceId);
    });
  });
});
