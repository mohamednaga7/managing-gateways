import React, { useState } from "react";

interface Props {
  show: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  defaultErrorMessage: string;
  title: string;
  text?: string;
}

export const ConfirmationModal: React.FC<Props> = ({
  show,
  onClose,
  onConfirm,
  defaultErrorMessage,
  title,
  text,
}) => {
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);
  const [sendingRequest, setSendingRequest] = useState(false);
  const handleConfirm = async () => {
    try {
      setSendingRequest(true);
      await onConfirm();
      setSendingRequest(false);
      onClose();
    } catch (e: any) {
      setSubmissionErrors(e.response.data.errors || [defaultErrorMessage]);
    }
  };
  return (
    <>
      <input
        type="checkbox"
        id="confirmation-modal"
        checked={show}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">{title}</h3>
          {submissionErrors.length > 0 && (
            <div className="bg-red-100 mb-5 p-2">
              {submissionErrors.map((err, index) => (
                <div key={index} className="text-red-500">
                  {err}
                </div>
              ))}
            </div>
          )}
          {text !== undefined && <p>{text}</p>}
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
              onClick={handleConfirm}
              className="btn"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
