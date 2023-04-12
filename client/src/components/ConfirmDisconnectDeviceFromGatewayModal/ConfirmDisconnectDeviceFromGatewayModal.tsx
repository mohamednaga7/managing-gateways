import React, { useState } from "react";
import { Gateway } from "../../types/gateways";
import { Device } from "../../types/device";
import { disconnectDeviceFromGateway } from "../../services/gateways-service";

interface Props {
  gateway: Gateway;
  device: Device;
  show: boolean;
  onClose: () => void;
}

export const DisconnectDeviceFromGatewayModal: React.FC<Props> = ({
  gateway,
  device,
  show,
  onClose,
}) => {
  const [sendingRequest, setSendingRequest] = useState(false);
  const handleDisconnectDeviceFromGateway = async () => {
    setSendingRequest(true);
    await disconnectDeviceFromGateway(gateway._id, device._id);
    setSendingRequest(false);
    onClose();
  };
  return (
    <>
      <input
        type="checkbox"
        id="disconnect-device-modal"
        checked={device !== null}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">Confirm Disconnect Device</h3>
          <p>
            Are you sure you want to disconnect the device with UID {device.UID}{" "}
            from gateway {gateway.name}
          </p>
          <div className="modal-action">
            <button
              disabled={sendingRequest}
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              disabled={sendingRequest}
              onClick={handleDisconnectDeviceFromGateway}
              className="btn"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
