import React from "react";
import { useForm } from "react-hook-form";
import { addDeviceToModal } from "../../services/gateways-service";
import { Device } from "../../types/device";
import { createDevice } from "../../services/devices-service";

interface Props {
  gatewayId: string | null;
  show: boolean;
  onClose: () => void;
}

type FormValues = Pick<Device, "UID" | "vendor">;

export const CreateDeviceModal: React.FC<Props> = ({
  gatewayId,
  show,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    if (gatewayId) await addDeviceToModal(gatewayId, data);
    else await createDevice(data);
    onClose();
  };

  return (
    <>
      <input
        type="checkbox"
        id="create-device-modal"
        checked={show}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">Create Device</h3>
          <form
            id="add-device-to-gateway-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="UID"
              className="input input-bordered w-full"
              {...register("UID", { required: true })}
            />
            <input
              type="text"
              placeholder="Vendor"
              className="input input-bordered w-full"
              {...register("vendor", {
                required: true,
              })}
            />
          </form>
          <div className="modal-action">
            <button
              disabled={isSubmitting}
              onClick={() => {
                if (isSubmitting) return;
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
        </div>
      </div>
    </>
  );
};
