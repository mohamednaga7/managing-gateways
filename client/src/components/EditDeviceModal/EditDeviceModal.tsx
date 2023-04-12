import React from "react";
import { useForm } from "react-hook-form";
import { Device } from "../../types/device";
import { updateDevice } from "../../services/devices-service";

interface Props {
  device: Device | null;
  onClose: () => void;
}

type FormValues = Partial<Pick<Device, "UID" | "vendor">>;

export const EditDeviceModal: React.FC<Props> = ({ device, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    values: { ...device },
  });

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    if (device) await updateDevice(device._id, data);
    reset();
    onClose();
  };

  return (
    <>
      <input
        type="checkbox"
        id="edit-device-modal"
        checked={device !== null}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">Edit Device</h3>
          <form
            id="edit-device-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder=""
              className="input input-bordered w-full"
              {...register("UID", { required: true })}
            />
            <input
              type="text"
              placeholder="IP Address"
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
              form="edit-device-form"
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
