import React from "react";
import { Navigate, Route, Routes as RoutesRRD } from "react-router-dom";
import { GatewaysScreen } from "../../screens/GatewaysScreen/GatewaysScreen";
import { DevicesScreen } from "../../screens/DevicesScreen.tsx/DevicesScreen";
import { GatewayDetailsScreen } from "../../screens/GatewayDetailsScreen/GatewayDetailsScreen";

export const Routes: React.FC = () => {
  return (
    <RoutesRRD>
      <Route path="/gateways" element={<GatewaysScreen />} />
      <Route path="/devices" element={<DevicesScreen />} />

      <Route path="/gateways/:id" element={<GatewayDetailsScreen />} />

      <Route path="/" element={<Navigate to="/gateways" replace />} />
      <Route path="*" element={<Navigate to="/gateways" replace />} />
    </RoutesRRD>
  );
};
