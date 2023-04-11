import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  UID: string;

  @IsString()
  @IsNotEmpty()
  vendor: string;
}
