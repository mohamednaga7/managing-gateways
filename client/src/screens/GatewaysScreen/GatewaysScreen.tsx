import React, { useState } from "react";
import { GatewaysList } from "../../components/GatewaysList/GatewaysList";
import { CreateGatewayModal } from "../../components/CreateGatewayModal/CreateGatewayModal";

export const GatewaysScreen: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <div className="w-full">
      <CreateGatewayModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <div className="h-20 mb-4 border-b px-5  border-gray-100 shadow-sm flex items-center">
        <div className="flex w-full justify-between">
          <h2 className="text-lg font-bold uppercase">Gateways</h2>
          <div
            className="btn btn-primary btn-sm"
            onClick={() => setShowCreateModal(true)}
          >
            Add Gateway
          </div>
        </div>
      </div>
      <GatewaysList searchQuery={searchQuery} />
    </div>
  );
};
