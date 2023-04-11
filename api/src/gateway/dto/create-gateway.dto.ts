import { IsNotEmpty, IsString } from "class-validator";

export class CreateGatewayDto {
  @IsString()
  @IsNotEmpty()
  serial: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  IPv4: string;
}
