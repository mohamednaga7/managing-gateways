import React from "react";
import { Gateway } from "../../types/gateways";
import { Link } from "react-router-dom";
import { GatewayIcon } from "../../assets/GatewayIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { EditIcon } from "../../assets/icons/EditIcon";

interface GatewaysListItemProps {
  gateway: Gateway;
  showEditModal: () => void;
  showConfirmDeleteModal: () => void;
}

export const GatewaysListItem: React.FC<GatewaysListItemProps> = ({
  gateway,
  showConfirmDeleteModal,
  showEditModal,
}) => {
  return (
    <div className="relative border border-gray-100 shadow-sm shadow-gray-200 group py-4 px-2 sm:px-4 w-[30rem] max-w-full overflow-hidden flex items-stretch gap-3 md:gap-5 rounded-md transition-all">
      <div className="absolute right-2 flex gap-2">
        <button
          className="btn px-1 btn-xs btn-ghost"
          onClick={showConfirmDeleteModal}
        >
          <TrashIcon />
        </button>
        <button className="btn px-1 btn-xs btn-ghost" onClick={showEditModal}>
          <EditIcon />
        </button>
      </div>
      <div className="flex justify-center items-center">
        <GatewayIcon />
      </div>
      <div className="grow flex-col justify-between max-w-full">
        <Link
          to={`/gateways/${gateway._id}`}
          className="block text-md font-bold uppercase mb-2 max-w-[73%] text-blue-500"
        >
          {gateway.name}
        </Link>
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 max-w-full">
          <span className="text-gray-400 font-bold text-sm sm:text-md">
            IP:
          </span>
          <span className="col-span-2">{gateway.IPv4}</span>
          <span className="text-gray-400 font-bold text-sm sm:text-md">
            Serial:
          </span>
          <span className="col-span-2">{gateway.serial}</span>
          <span className="text-gray-400 font-bold text-sm sm:text-md">
            Devices:
          </span>
          <span className="col-span-2">{gateway.devices.length}</span>
        </div>
      </div>
    </div>
  );
};
