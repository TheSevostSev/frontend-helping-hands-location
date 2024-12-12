"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { getListLocations } from "@/app/api/location";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const MainMap: React.FC = ({}) => {
  const { data: helpingHandsLocations } = useQuery({
    queryFn: getListLocations,
    queryKey: ["helpingHandsLocations"],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Map
      zoomControl={true}
      markUserLocation={true}
      helpingHandsLocations={helpingHandsLocations}
    ></Map>
  );
};

export default MainMap;
