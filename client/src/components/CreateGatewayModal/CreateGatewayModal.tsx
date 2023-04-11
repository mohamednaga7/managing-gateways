import { isIPV4Address } from "ip-address-validator";
import React from "react";
import { useForm } from "react-hook-form";
import { createGateway } from "../../services/gateways-service";

interface Props {
  show: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  IPv4: string;
  serial: string;
}

export const CreateGatewayModal: React.FC<Props> = ({ show, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    await createGateway(data);
    onClose();
  };

  return (
    <>
      <input
        type="checkbox"
        id="delete-gateway-modal"
        checked={show}
        readOnly
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-5 text-xl">Create Gateway</h3>
          <form
            id="create-gateway-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
              {...register("name", { required: true })}
            />
            <input
              type="text"
              placeholder="IP Address"
              className="input input-bordered w-full"
              {...register("IPv4", {
                required: true,
                validate: (value) => {
                  return isIPV4Address(value);
                },
              })}
            />
            <input
              type="text"
              placeholder="Serial Number"
              className="input input-bordered w-full"
              {...register("serial", { required: true })}
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
              form="create-gateway-form"
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
