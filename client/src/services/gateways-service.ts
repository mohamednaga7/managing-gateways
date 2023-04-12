import { Device } from "../types/device";
import {
  CreateGatewayData,
  FetchGatewaysResponse,
  Gateway,
} from "../types/gateways";
import { axiosInstance } from "../utils/axiosInstance";

export const fetchGateways = async ({
  query,
  page,
  pageSize,
}: {
  query?: string;
  page?: number;
  pageSize?: number;
}) => {
  const { data } = await axiosInstance.get<FetchGatewaysResponse>("/gateways", {
    params: {
      query: query || undefined,
      page: page || 1,
      pageSize: pageSize || 20,
    },
  });
  return data;
};

export const fetchGatewayDetails = async (id?: string) => {
  if (!id) return null;
  const { data } = await axiosInstance.get<Gateway>(`/gateways/${id}`);
  return data;
};

export const createGateway = async (gateway: CreateGatewayData) => {
  const { data } = await axiosInstance.post<Gateway>("/gateways", gateway);
  return data;
};

export const updateGateway = async (
  id: string,
  updateGateway: Partial<Pick<Gateway, "IPv4" | "name" | "serial">>
) => {
  const { data } = await axiosInstance.patch(`/gateways/${id}`, updateGateway);
  return data;
};

export const deleteGateway = async (id: string) => {
  const { data } = await axiosInstance.delete(`/gateways/${id}`);
};

export const addDeviceToModal = async (
  gatewayId: string,
  data: Pick<Device, "UID" | "vendor">
) => {
  const { data: response } = await axiosInstance.post(
    `/gateways/${gatewayId}/devices`,
    data
  );
  return response;
};

export const connectDeviceToGateway = async (
  gatewayId: string,
  deviceId: string
) => {
  const { data } = await axiosInstance.patch(
    `/gateways/${gatewayId}/devices/${deviceId}`
  );
  return data;
};

export const disconnectDeviceFromGateway = async (
  gatewayId: string,
  deviceId: string
) => {
  const { data } = await axiosInstance.delete(
    `/gateways/${gatewayId}/devices/${deviceId}`
  );
  return data;
};
