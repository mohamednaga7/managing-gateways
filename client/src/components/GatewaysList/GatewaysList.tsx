import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteGateway, fetchGateways } from "../../services/gateways-service";
import { GatewaysListItem } from "../GatewaysListItem/GatewaysListItem";
import { Gateway } from "../../types/gateways";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { CreateGatewayModal } from "../CreateGatewayModal/CreateGatewayModal";

interface GatewaysListProps {
  searchQuery?: string;
}

export const GatewaysList: React.FC<GatewaysListProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDeletingGateway, setCurrentDeletingGateway] =
    useState<Gateway | null>(null);

  const [currentEditingGateway, setCurrentEditingGateway] =
    useState<Gateway | null>(null);

  const { data, isLoading } = useQuery(
    ["getGateways", currentPage, searchQuery],
    async () => {
      const result = await fetchGateways({
        page: currentPage,
        pageSize: 18,
        query: searchQuery,
      });

      return result;
    },
    {
      keepPreviousData: true,
      refetchInterval: 1000,
    }
  );

  const handleConfirmDelete = async () => {
    if (!currentDeletingGateway) return;
    await deleteGateway(currentDeletingGateway._id);
  };

  return (
    <>
      <ConfirmationModal
        defaultErrorMessage="Error deleting the Gateway"
        onClose={() => setCurrentDeletingGateway(null)}
        onConfirm={handleConfirmDelete}
        show={currentDeletingGateway !== null}
        title="Confirm Delete Gateway"
        text={"Are you sure you want to delete this gateway?"}
      />
      <CreateGatewayModal
        show={currentEditingGateway !== null}
        gateway={currentEditingGateway || undefined}
        onClose={() => setCurrentEditingGateway(null)}
      />
      {data?.gateways?.length ? (
        <div className="grid mx-auto lg:mx-0 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 px-2 sm:px-5 py-5 gap-5 w-max max-w-full">
          {data.gateways.map((gateway) => (
            <GatewaysListItem
              gateway={gateway}
              key={gateway._id}
              showConfirmDeleteModal={() => setCurrentDeletingGateway(gateway)}
              showEditModal={() => setCurrentEditingGateway(gateway)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div>No Gateways Found</div>
        </div>
      )}
    </>
  );
};
