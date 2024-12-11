"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const MainMap: React.FC = ({}) => {
  return <Map zoomControl={true} markUserLocation={true}></Map>;
};

export default MainMap;
