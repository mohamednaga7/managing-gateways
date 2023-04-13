import React from "react";
import { useForm } from "react-hook-form";
import { addDeviceToModal } from "../../services/gateways-service";
import { Device } from "../../types/device";
import { createDevice, updateDevice } from "../../services/devices-service";
import { Modal } from "../Modal/Modal";

interface Props {
  gatewayId?: string | null;
  device?: Device | null;
  show: boolean;
  onClose: () => void;
}

type FormValues = Pick<Device, "UID" | "vendor">;

export const CreateDeviceModal: React.FC<Props> = ({
  gatewayId,
  device,
  show,
  onClose,
}) => {
  const [submissionErrors, setSubmissionErrors] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    values: device ? { ...device } : undefined,
  });

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    setSubmissionErrors([]);
    try {
      if (device) await updateDevice(device._id, data);
      else {
        if (gatewayId) await addDeviceToModal(gatewayId, data);
        else await createDevice(data);
      }
      onClose();
    } catch (e: any) {
      setSubmissionErrors(
        e?.response?.data?.errors || ["Error saving changes"]
      );
    }
  };

  return (
    <Modal show={show} onClose={onClose} modalId="create-device-modal">
      <h3 className="font-bold mb-5 text-xl">Create Device</h3>
      {submissionErrors.length > 0 && (
        <div className="bg-red-100 mb-5 p-2">
          {submissionErrors.map((err, index) => (
            <div key={index} className="text-red-500">
              {err}
            </div>
          ))}
        </div>
      )}
      {show && (
        <form
          id="add-device-to-gateway-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <input
              type="text"
              placeholder="UID"
              className={`input input-bordered w-full ${
                errors && errors.UID ? "border-red-500" : ""
              }`}
              {...register("UID", { required: device ? false : true })}
            />
            {errors && errors.UID && (
              <span className="text-red-500 text-xs">
                {errors.UID.message || "UID is required"}
              </span>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Vendor"
              className={`input input-bordered w-full ${
                errors && errors.vendor ? "border-red-500" : ""
              }`}
              {...register("vendor", {
                required: device ? false : true,
              })}
            />
            {errors && errors.vendor && (
              <span className="text-red-500 text-xs">
                {errors.vendor.message || "Vendor is required"}
              </span>
            )}
          </div>
        </form>
      )}
      <div className="modal-action">
        <button
          disabled={isSubmitting}
          onClick={() => {
            if (isSubmitting) return;
            setSubmissionErrors([]);
            reset();
            onClose();
          }}
          className="btn btn-ghost"
        >
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          form="add-device-to-gateway-form"
          type="submit"
          className="btn"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
};
