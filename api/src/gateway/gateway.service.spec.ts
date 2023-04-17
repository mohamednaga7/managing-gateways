import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from './gateway.service';
import { getModelToken } from '@nestjs/mongoose';
import { DeviceService } from '../device/device.service';
import { Model } from 'mongoose';
import { Gateway } from './entities/gateway.entity';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { BadRequestException } from '@nestjs/common';

describe('GatewayService', () => {
  let service: GatewayService;
  let gatewayModel: Model<Gateway>;
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
    gatewayModel = module.get<Model<Gateway>>(getModelToken('Gateway'));
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
});
