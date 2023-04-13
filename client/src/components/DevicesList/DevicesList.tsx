import React, { useState } from "react";
import { Device } from "../../types/device";
import { DeviceListItem } from "../DeviceListItem/DeviceListItem";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { deleteDevice } from "../../services/devices-service";
import { CreateDeviceModal } from "../CreateDeviceModal/CreateDeviceModal";

interface DevicesListProps {
  data: Device[];
  gatewayId?: string;
}

export const DevicesList: React.FC<DevicesListProps> = ({
  data,
  gatewayId,
}) => {
  const [currentDeletingDevice, setCurrentDeletingDevice] =
    useState<Device | null>(null);

  const [currentEditingDevice, setCurrentEditingDevice] =
    useState<Device | null>(null);

  const handleDeleteDevice = async () => {
    if (!currentDeletingDevice) return;
    await deleteDevice(currentDeletingDevice._id);
    return;
  };

  return (
    <div>
      <ConfirmationModal
        defaultErrorMessage="Error Deleting Device"
        onClose={() => setCurrentDeletingDevice(null)}
        onConfirm={handleDeleteDevice}
        show={currentDeletingDevice !== null}
        title="Confirm Delete Device"
        text="Are you sure you want to delete this device?"
      />
      <CreateDeviceModal
        show={currentEditingDevice !== null}
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
            gatewayId={gatewayId}
          />
        ))}
      </div>
    </div>
  );
};
