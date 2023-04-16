import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { GatewayIcon } from "../../assets/GatewayIcon";
import { fetchGatewayDetails } from "../../services/gateways-service";
import { CreateDeviceModal } from "../../components/CreateDeviceModal/CreateDeviceModal";
import { DevicesList } from "../../components/DevicesList/DevicesList";
import { ConnectDeviceToGatewayModal } from "../../components/ConnectDeviceToGatewayModal/ConnectDeviceToGatewayModal";
import { RightArrowIcon } from "../../assets/icons/RightArrowIcon";

export const GatewayDetailsScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showAddDeviceToGatewayModal, setShowAddDeviceToGatewayModal] =
    useState(false);

  const [showConnectDeviceToGatewayModal, setShowConnectDeviceToGatewayModal] =
    useState(false);

  const { data: gateway, isLoading } = useQuery(
    ["gateway/fetchGatewayDetails", id],
    () => fetchGatewayDetails(id),
    {
      keepPreviousData: true,
      refetchInterval: 1000,
    }
  );

  const handleDisplayAddDeviceToGatewayModal = () => {
    if (!gateway) return;
    if (gateway?.devices.length >= 10) {
      toast("Each gateway can only have 10 devices", {
        type: "error",
        toastId: "only-1-device-for-gateway-add",
      });
      return;
    }
    setShowAddDeviceToGatewayModal(true);
  };

  const handleDisplayConnectDeviceToGatewayModal = () => {
    if (!gateway) return;
    if (gateway?.devices.length >= 10) {
      toast("Each gateway can only have 10 devices", {
        type: "error",
        toastId: "only-1-device-for-gateway-add",
      });
      return;
    }
    setShowConnectDeviceToGatewayModal(true);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!gateway) {
    return <div>No Gateway Found</div>;
  }

  return (
    <div className="relative py-5 px-5">
      <ToastContainer
        position="top-center"
        progressStyle={{ background: "blue" }}
      />
      <button
        className="rotate-180 mb-6 btn btn-ghost border border-gray-200 btn-sm rounded-full h-10 w-10"
        onClick={() => {
          navigate("/gateways");
        }}
      >
        <RightArrowIcon />
      </button>
      <div className="flex flex-col items-start gap-5">
        <div className="flex justify-center items-center mb-3">
          <GatewayIcon />
          <div className="text-xl font-bold uppercase ml-10">
            {gateway.name}
          </div>
        </div>
        <div className="grow flex-col justify-between max-w-full">
          <div className="grid grid-cols-3 gap-x-2 gap-y-1 max-w-full">
            <span className="text-gray-400 font-bold text-sm sm:text-md">
              IP:
            </span>
            <span className="col-span-2">{gateway.IPv4}</span>
            <span className="text-gray-400 font-bold text-sm sm:text-md">
              Serial:
            </span>
            <span className="col-span-2">{gateway.serial}</span>
            <span className="text-gray-400 font-bold text-sm sm:text-md">
              Devices:
            </span>
            <span className="col-span-2">{gateway.devices.length}</span>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <CreateDeviceModal
        gatewayId={gateway._id}
        onClose={() => setShowAddDeviceToGatewayModal(false)}
        show={showAddDeviceToGatewayModal}
      />
      <ConnectDeviceToGatewayModal
        gateway={gateway}
        show={showConnectDeviceToGatewayModal}
        onClose={() => {
          setShowConnectDeviceToGatewayModal(false);
        }}
      />
      <div className="flex flex-col sm:flex-row mb-6 gap-4 justify-between items-center">
        <h2 className="text-lg font-bold uppercase">Devices</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleDisplayConnectDeviceToGatewayModal}
            className="btn btn-primary btn-sm"
          >
            Connect Existing Devices
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleDisplayAddDeviceToGatewayModal}
          >
            Add Device To Gateway
          </button>
        </div>
      </div>
      <DevicesList gatewayId={gateway._id} data={gateway.devices} />
    </div>
  );
};
