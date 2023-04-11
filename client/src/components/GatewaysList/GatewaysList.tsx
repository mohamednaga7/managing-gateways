import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchGateways } from "../../services/gateways-service";
import { GatewaysListItem } from "../GatewaysListItem/GatewaysListItem";
import { Gateway } from "../../types/gateways";
import { DeleteGatewayModal } from "../DeleteGatewayModal/DeleteGatewayModal";
import { EditGatewayModal } from "../EditGatewayModal/EditGatewayModal";

interface GatewaysListProps {
  searchQuery?: string;
}

export const GatewaysList: React.FC<GatewaysListProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDeletingGateway, setCurrentDeletingGateway] =
    useState<Gateway | null>(null);

  const [currentEditingGateway, setCurrentEditingGateway] =
    useState<Gateway | null>(null);

  const { data, isLoading } = useInfiniteQuery(
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
      refetchInterval: 1500,
    }
  );
  return (
    <div className="grid mx-auto lg:mx-0 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 px-2 sm:p-5 py-5 gap-5 w-max max-w-full">
      <DeleteGatewayModal
        gateway={currentDeletingGateway}
        onClose={() => setCurrentDeletingGateway(null)}
      />
      <EditGatewayModal
        gateway={currentEditingGateway}
        onClose={() => setCurrentEditingGateway(null)}
      />
      {data?.pages[0].gateways.map((gateway) => (
        <GatewaysListItem
          gateway={gateway}
          key={gateway._id}
          showConfirmDeleteModal={() => setCurrentDeletingGateway(gateway)}
          showEditModal={() => setCurrentEditingGateway(gateway)}
        />
      ))}
    </div>
  );
};
