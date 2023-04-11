import React, { useState } from "react";
import { Gateway } from "../../types/gateways";
import { deleteGateway } from "../../services/gateways-service";

interface DeleteGatewayModalProps {
  gateway: Gateway | null;
  onClose: () => void;
}

export const DeleteGatewayModal: React.FC<DeleteGatewayModalProps> = ({
  gateway,
  onClose,
}) => {
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleDeleteGateway = async () => {
    if (!gateway) return;
    setSendingRequest(true);
    await deleteGateway(gateway._id);
    setSendingRequest(false);
    onClose();
  };
  return (
    <>
      <input
        type="checkbox"
        id="delete-gateway-modal"
        checked={gateway !== null}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">Confirm Delete</h3>
          <p>
            Are you sure you want to delete gateway{" "}
            <span className="font-bold">{gateway?.name}</span>
          </p>
          <div className="modal-action">
            <button onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleDeleteGateway} className="btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
