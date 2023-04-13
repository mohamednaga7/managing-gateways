import React from "react";

interface ModalProps extends React.PropsWithChildren {
  show: boolean;
  onClose: () => void;
  modalId: string;
}
export const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  modalId,
  children,
}) => {
  return (
    <>
      <input
        type="checkbox"
        id={modalId}
        checked={show}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </>
  );
};
