import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  UID: string;

  @IsString()
  @IsNotEmpty()
  vendor: string;

  @IsOptional()
  @IsEnum(['ONLINE', 'OFFLINE'])
  status?: string;
}
