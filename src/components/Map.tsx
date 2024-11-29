"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map: React.FC = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const defaultLocation = { latitude: 40.4168, longitude: -3.7038 };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setLocation(defaultLocation);
        }
      );
    } else {
      setLocation(defaultLocation);
    }
  }, [hasMounted]);

  useEffect(() => {
    if (hasMounted && location) {
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        const map = L.map(mapContainer, {
          center: [location.latitude, location.longitude],
          zoom: 13,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          map
        );

        return () => {
          map.remove();
        };
      }
    }
  }, [location, hasMounted]);

  if (!hasMounted) {
    return null;
  }

  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
};

export default Map;
