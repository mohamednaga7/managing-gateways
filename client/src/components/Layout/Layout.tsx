import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RightArrowIcon } from "../../assets/icons/RightArrowIcon";
import { NavbarButtonIcon } from "../../assets/icons/NavbarButtonIcon";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="drawer drawer-mobile">
      <input
        id="my-drawer-2"
        type="checkbox"
        checked={showMenu}
        readOnly
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col items-center">
        <div className="h-screen w-full">
          <button
            onClick={() => {
              setShowMenu(true);
            }}
            className="absolute cursor-pointer right-4 btn btn-ghost btn-xs border hover:shadow-md z-10 rounded-md border-gray-200 drawer-button lg:hidden mt-5"
          >
            <NavbarButtonIcon />
          </button>
          <main className="pt-10 lg:pt-0">{children}</main>
        </div>
      </div>
      <div className="drawer-side border-r">
        <label
          htmlFor="my-drawer-2"
          className="drawer-overlay"
          onClick={() => {
            setShowMenu(false);
          }}
        ></label>
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
