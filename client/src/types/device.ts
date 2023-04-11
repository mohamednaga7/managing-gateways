export type DeviceStatus = "ONLINE" | "OFFLINE";

export interface Device {
  _id: string;
  UID: string;
  vendor: string;
  createdAt: Date;
  status: DeviceStatus;
}

export interface FetchDevicesResponse {
  devices: Device[];
  total: number;
}
