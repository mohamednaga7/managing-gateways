import React from "react";
import { NavLink } from "react-router-dom";
import { RightArrowIcon } from "../../assets/icons/LeftArrowIcon";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center">
        <div className="h-screen w-full">
          <label
            htmlFor="my-drawer-2"
            className="absolute btn btn-ghost btn-xs border -translate-x-1 rounded-tr-lg rounded-br-lg border-gray-200 drawer-button lg:hidden mt-5"
          >
            <RightArrowIcon />
          </label>
          {children}
        </div>
      </div>
      <div className="drawer-side border-r">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu gap-4 p-4 w-64 bg-base-100 text-base-content">
          <li>
            <NavLink to="/gateways">Gateways</NavLink>
          </li>
          <li>
            <NavLink to="/devices">Devices</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
