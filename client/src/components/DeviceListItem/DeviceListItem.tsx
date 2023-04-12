import React from "react";
import { Device } from "../../types/device";
import { MenuIcon } from "../../assets/icons/MenuIcon";
import { DeviceIcon } from "../../assets/icons/DeviceIcon";

interface DeviceListItemProps {
  device: Device;
  showEditModal?: () => void;
  showConfirmDeleteModal?: () => void;
  noActions?: boolean;
  isSelected?: boolean;
}

export const DeviceListItem: React.FC<DeviceListItemProps> = ({
  device,
  showConfirmDeleteModal,
  showEditModal,
  noActions = false,
  isSelected = false,
}) => {
  return (
    <div
      className={`relative border w-full h-full border-gray-50 shadow-sm shadow-gray-200 rounded-md flex items-center flex-col p-4 gap-4 ${
        isSelected ? "bg-blue-50" : ""
      }`}
    >
      {!noActions && (
        <div className="absolute right-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-xs btn-ghost px-0">
              <MenuIcon />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
            >
              <li>
                <button onClick={showEditModal}>Edit</button>
              </li>
              <li>
                <button onClick={showConfirmDeleteModal}>Delete</button>
              </li>
            </ul>
          </div>
        </div>
      )}
      <span>
        <DeviceIcon />
      </span>
      <div className="grid grid-cols-3">
        <span className="text-gray-400 font-bold pr-2">UID:</span>
        <span className="col-span-2">{device.UID}</span>
        <span className="text-gray-400 font-bold pr-2">Vendor:</span>
        <span className="col-span-2">{device.vendor}</span>
        <span className="text-gray-400 font-bold pr-2">Status:</span>
        <span className="col-span-2">{device.status}</span>
      </div>
    </div>
  );
};
