import { Device, FetchDevicesResponse } from "../types/device";
import { axiosInstance } from "../utils/axiosInstance";

export const fetchDevices = async ({
  page,
  pageSize,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}) => {
  const { data } = await axiosInstance.get<FetchDevicesResponse>("/devices", {
    params: {
      page: page || 1,
      pageSize: pageSize || 20,
      query: query || undefined,
    },
  });
  return data;
};

export const createDevice = async (device: Pick<Device, "UID" | "vendor">) => {
  const { data } = await axiosInstance.post("/devices", device);
  return data;
};

export const updateDevice = async (
  deviceId: string,
  device: Partial<Device>
) => {
  const { data } = await axiosInstance.patch(`/devices/${deviceId}`, device);
  return data;
};

export const deleteDevice = async (deviceId: string) => {
  const { data } = await axiosInstance.delete(`/devices/${deviceId}`);
  return data;
};
