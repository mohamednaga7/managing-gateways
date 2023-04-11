import { isIPV4Address } from "ip-address-validator";
import React from "react";
import { useForm } from "react-hook-form";
import { updateGateway } from "../../services/gateways-service";
import { Gateway } from "../../types/gateways";

interface Props {
  gateway: Gateway | null;
  onClose: () => void;
}

interface FormValues {
  name?: string;
  IPv4?: string;
  serial?: string;
}

export const EditGatewayModal: React.FC<Props> = ({ gateway, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    values: { ...gateway },
  });

  const onSubmit = async (data: FormValues) => {
    if (!gateway || isSubmitting) return;
    await updateGateway(gateway?._id, data);
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
          <h3 className="font-bold mb-5 text-xl">Edit Gateway</h3>
          <form
            id="edit-gateway-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
              {...register("name", { required: false })}
            />
            <input
              type="text"
              placeholder="IP Address"
              className="input input-bordered w-full"
              {...register("IPv4", {
                required: false,
                validate: (value) => {
                  return isIPV4Address(value);
                },
              })}
            />
            <input
              type="text"
              placeholder="Serial Number"
              className="input input-bordered w-full"
              {...register("serial", { required: false })}
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
              form="edit-gateway-form"
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
