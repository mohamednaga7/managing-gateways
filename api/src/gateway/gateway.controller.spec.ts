import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { DeviceService } from '../device/device.service';

describe('GatewayController', () => {
  let controller: GatewayController;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [GatewayController],
    //   providers: [GatewayService, DeviceService],
    // }).compile();
    // controller = module.get<GatewayController>(GatewayController);
  });

  it('should be defined', () => {
    // expect(controller).toBeDefined();
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});
