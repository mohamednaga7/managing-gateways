import React, { useState } from "react";
import { Device } from "../../types/device";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDevices } from "../../services/devices-service";
import { DeleteDeviceModal } from "../DeleteDeviceModal/DeleteDeviceModal";
import { EditDeviceModal } from "../EditDeviceModal/EditDeviceModal";
import { CreateDeviceModal } from "../CreateDeviceModal/CreateDeviceModal";
import { DeviceListItem } from "../DeviceListItem/DeviceListItem";

interface DevicesListProps {
  data: Device[];
  devicesScreen?: boolean;
}

export const DevicesList: React.FC<DevicesListProps> = ({
  data,
  devicesScreen = false,
}) => {
  const [currentDeletingDevice, setCurrentDeletingDevice] =
    useState<Device | null>(null);

  const [currentEditingDevice, setCurrentEditingDevice] =
    useState<Device | null>(null);

  return (
    <div>
      <DeleteDeviceModal
        device={currentDeletingDevice}
        onClose={() => setCurrentDeletingDevice(null)}
      />
      <EditDeviceModal
        device={currentEditingDevice}
        onClose={() => setCurrentEditingDevice(null)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((device) => (
          <DeviceListItem
            device={device}
            key={device._id}
            showConfirmDeleteModal={() => setCurrentDeletingDevice(device)}
            showEditModal={() => setCurrentEditingDevice(device)}
          />
        ))}
      </div>
    </div>
  );
};
