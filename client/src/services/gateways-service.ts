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
