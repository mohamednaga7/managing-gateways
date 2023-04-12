import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { fetchDevices } from "../../services/devices-service";
import { Gateway } from "../../types/gateways";
import { DeviceListItem } from "../DeviceListItem/DeviceListItem";
import { connectDeviceToGateway } from "../../services/gateways-service";

interface Props {
  show: boolean;
  gateway: Gateway;
  onClose: () => void;
}

export const ConnectDeviceToGatewayModal: React.FC<Props> = ({
  gateway,
  show,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const { data, remove, refetch } = useInfiniteQuery(
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

  const devices = useMemo(() => {
    if (data && data.pages.length > 0) {
      return data.pages[0].devices.filter((device) => {
        return !gateway.devices.find((gatewayDevice) => {
          return gatewayDevice._id === device._id;
        });
      });
    }
  }, [data]);

  const handleConnectDeviceAndGateway = async () => {
    if (!selectedDeviceId) return;
    setSendingRequest(true);
    await connectDeviceToGateway(gateway._id, selectedDeviceId);
    remove();
    setSelectedDeviceId(null);
    setSendingRequest(false);
    onClose();
  };
  return (
    <>
      <input
        type="checkbox"
        id="edit-device-modal"
        checked={show}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">Select Device</h3>
          {devices?.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500 text-xl uppercase font-bold">
                No devices available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices?.map((device) => (
                <div
                  key={device._id}
                  className="cursor-pointer w-full h-full"
                  onClick={() => {
                    setSelectedDeviceId(device._id);
                  }}
                >
                  <DeviceListItem
                    device={device}
                    noActions
                    isSelected={selectedDeviceId === device._id}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="modal-action">
            <button
              onClick={() => {
                onClose();
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              disabled={!selectedDeviceId || sendingRequest}
              className="btn"
              onClick={handleConnectDeviceAndGateway}
            >
              {sendingRequest ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
