import { isIPV4Address } from "ip-address-validator";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createGateway, updateGateway } from "../../services/gateways-service";
import { Modal } from "../Modal/Modal";
import { Gateway } from "../../types/gateways";

interface Props {
  gateway?: Gateway;
  show: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  IPv4: string;
  serial: string;
}

export const CreateGatewayModal: React.FC<Props> = ({
  show,
  onClose,
  gateway,
}) => {
  const [submissionErrors, setSubmissionErrors] = React.useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    values: gateway ? { ...gateway } : undefined,
  });

  useEffect(() => {
    if (gateway) {
    }
  }, [gateway]);

  const onSubmit = async (data: FormValues) => {
    console.log("submitting", data);
    if (isSubmitting) return;
    try {
      if (gateway !== undefined) {
        await updateGateway(gateway._id, data);
      } else {
        await createGateway(data);
      }
      onClose();
    } catch (e: any) {
      setSubmissionErrors(
        e?.response?.data?.errors || ["Error creating gateway"]
      );
    }
  };

  return (
    <Modal modalId="create-gateway-modal" onClose={onClose} show={show}>
      <h3 className="font-bold mb-5 text-xl">
        {gateway ? "Edit" : "Create"} Gateway
      </h3>
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
          id="create-gateway-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <input
              type="text"
              placeholder="Name"
              className={`input input-bordered w-full ${
                errors && errors.name ? "border-red-500" : ""
              }`}
              {...register("name", { required: gateway ? false : true })}
            />
            {errors && errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message || "Name is required"}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="IP Address"
              className={`input input-bordered w-full ${
                errors && errors.IPv4 ? "border-red-500" : ""
              }`}
              {...register("IPv4", {
                required: gateway ? false : true,
                validate: (value) => {
                  if (!isIPV4Address(value)) {
                    return "Please enter a valid IPv4 address";
                  }
                },
              })}
            />
            {errors && errors.IPv4 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.IPv4.message || "IP Address is required"}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Serial Number"
              className={`input input-bordered w-full ${
                errors && errors.serial ? "border-red-500" : ""
              }`}
              {...register("serial", { required: gateway ? false : true })}
            />
            {errors && errors.serial && (
              <p className="text-red-500 text-sm mt-1">
                {errors.serial.message || "Serial Number is required"}
              </p>
            )}
          </div>
        </form>
      )}
      <div className="modal-action">
        <button
          disabled={isSubmitting}
          onClick={() => {
            if (isSubmitting) return;
            reset();
            setSubmissionErrors([]);
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
    </Modal>
  );
};
