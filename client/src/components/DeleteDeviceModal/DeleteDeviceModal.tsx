import React, { useState } from "react";
import { Device } from "../../types/device";
import { deleteDevice } from "../../services/devices-service";

interface DeleteDeviceModalProps {
  device: Device | null;
  onClose: () => void;
}

export const DeleteDeviceModal: React.FC<DeleteDeviceModalProps> = ({
  device,
  onClose,
}) => {
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleDeleteDevice = async () => {
    if (!device) return;
    setSendingRequest(true);
    await deleteDevice(device._id);
    setSendingRequest(false);
    onClose();
  };
  return (
    <>
      <input
        type="checkbox"
        id="delete-device-modal"
        checked={device !== null}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">Confirm Delete Device</h3>
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
              onClick={handleDeleteDevice}
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
