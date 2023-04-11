import { Device } from "./device";

export interface Gateway {
  _id: string;
  serial: string;
  name: string;
  IPv4: string;
  devices: Device[];
}

export interface CreateGatewayData {
  serial: string;
  name: string;
  IPv4: string;
}

export interface FetchGatewaysResponse {
  gateways: Gateway[];
  total: number;
}
