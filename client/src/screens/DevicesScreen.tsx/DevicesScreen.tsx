import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchDevices } from "../../services/devices-service";
import { DevicesList } from "../../components/DevicesList/DevicesList";
import { CreateDeviceModal } from "../../components/CreateDeviceModal/CreateDeviceModal";

export const DevicesScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDeviceModal, setShowCreateDeviceModal] = useState(false);

  const { data } = useInfiniteQuery(
    ["getDevices", currentPage],
    async () => {
      const result = await fetchDevices({
        page: currentPage,
        pageSize: 18,
      });

      return result;
    },
    {
      keepPreviousData: true,
      refetchInterval: 1000,
    }
  );
  return (
    <div className="p-5">
      <CreateDeviceModal
        gatewayId={null}
        onClose={() => setShowCreateDeviceModal(false)}
        show={showCreateDeviceModal}
      />
      <div className="flex flex-col sm:flex-row mb-6 gap-4 justify-between items-center">
        <h2 className="text-lg font-bold uppercase">Devices</h2>
        <div
          className="btn btn-primary btn-sm"
          onClick={() => setShowCreateDeviceModal(true)}
        >
          Add Device
        </div>
      </div>
      <hr className="my-5" />
      <DevicesList data={data?.pages[0].devices || []} />
    </div>
  );
};
