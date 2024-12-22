"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import React from "react";
import useTokenStore from "@/stores/useTokenStore";
import "leaflet/dist/leaflet.css";
import { Button } from "antd";
import { currentUser } from "@/app/api/current-user";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { deleteLocation } from "@/app/api/location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useLocationPopupStore from "@/stores/useLocationPopupStore";

interface MapProps {
  markUserLocation?: boolean | null;
  searchedLocationByAddress?: Coordinates | null;
  zoomControl: boolean;
  style?: object;
  zoom?: number;
  helpingHandsLocations?: HelpingHandsLocation[];
}

interface User {
  id: number;
}

const BaseMap: React.FC<MapProps> = ({
  markUserLocation,
  searchedLocationByAddress,
  zoomControl,
  style,
  zoom,
  helpingHandsLocations,
}) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const token = useTokenStore((state) => state.token);
  const toggleLocationShowPopup = useLocationPopupStore(
    (store) => store.toggleShowPopup
  );

  const setLocationFromStore = useLocationPopupStore(
    (store) => store.setLocation
  );

  const [user, setUser] = useState<User>({ id: 0 });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const searchedLocationMarkerRef = useRef<L.Marker | null>(null);

  const myLocationIcon = (size: number) =>
    L.icon({
      iconUrl: "/icons/my-location.png",
      iconSize: [size * 1.8, size * 1.8],
      iconAnchor: [size / 1.1, size * 1.5],
    });

  const searchedLocationByAddressIcon = (size: number) =>
    L.icon({
      iconUrl: "/icons/selected-location-by-address.png",
      iconSize: [size * 1.8, size * 1.8],
      iconAnchor: [size / 1.1, size * 1.5],
    });

  const helpinghandsLocationIcon = (size: number) =>
    L.icon({
      iconUrl: "/icons/helping-hands-location.png",
      iconSize: [size * 1.8, size * 1.8],
      iconAnchor: [size / 1.1, size * 1.5],
    });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["helpingHandsLocations"],
      });
      toast.success("Ubicación eleminada");
    },
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await currentUser();
        setUser(data);
      } catch {}
    };

    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  useEffect(() => {
    const defaultLocation = { latitude: 40.4168, longitude: -3.7038 };

    if (hasMounted) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude:
                searchedLocationByAddress?.latitude ?? position.coords.latitude,
              longitude:
                searchedLocationByAddress?.longitude ??
                position.coords.longitude,
            });
          },
          () => {
            setLocation({
              latitude:
                searchedLocationByAddress?.latitude ?? defaultLocation.latitude,
              longitude:
                searchedLocationByAddress?.longitude ??
                defaultLocation.longitude,
            });
          }
        );
      } else {
        setLocation({
          latitude:
            searchedLocationByAddress?.latitude ?? defaultLocation.latitude,
          longitude:
            searchedLocationByAddress?.longitude ?? defaultLocation.longitude,
        });
      }
    }
  }, [
    hasMounted,
    searchedLocationByAddress?.latitude,
    searchedLocationByAddress?.longitude,
  ]);

  useEffect(() => {
    if (hasMounted && location && !mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: zoom ?? 13,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );

      if (zoomControl) {
        L.control
          .zoom({
            position: "bottomright",
          })
          .addTo(mapRef.current);
      }

      if (markUserLocation) {
        userMarkerRef.current = L.marker(
          [location.latitude, location.longitude],
          { icon: myLocationIcon(50) }
        ).addTo(mapRef.current);
      }

      if (
        searchedLocationByAddress?.latitude &&
        searchedLocationByAddress?.longitude
      ) {
        searchedLocationMarkerRef.current = L.marker(
          [
            searchedLocationByAddress.latitude,
            searchedLocationByAddress.longitude,
          ],
          { icon: searchedLocationByAddressIcon(30) }
        ).addTo(mapRef.current);
      }

      if (helpingHandsLocations) {
        helpingHandsLocations.forEach((loc) => {
          if (loc.latitude && loc.longitude && mapRef.current) {
            const marker = L.marker([loc.latitude, loc.longitude], {
              icon: helpinghandsLocationIcon(35),
            }).addTo(mapRef.current);

            const popupContent = document.createElement("div");
            // eslint-disable-next-line react/no-deprecated
            ReactDOM.render(
              <>
                <div>
                  <b>Nombre:</b> {loc.name} <br />
                  <b>Etiquetas:</b> {loc.tags.map((tag) => tag.name).join(", ")}{" "}
                  <br />
                  <b>Dirección:</b> {loc.address}
                </div>
                {user.id == loc.creatorId ? (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Button
                      variant="solid"
                      color="danger"
                      onClick={() => {
                        setLocationFromStore(loc);
                        toggleLocationShowPopup();
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="solid"
                      color="danger"
                      onClick={() => {
                        if (loc.id) {
                          mutation.mutate(loc.id);
                        }
                        marker.closePopup();
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ) : null}
              </>,
              popupContent
            );

            marker.bindPopup(popupContent);
          }
        });
      }

      mapRef.current.on("zoomend", () => {
        const zoomLevel = mapRef.current ? mapRef.current.getZoom() : 13;
        const iconSize = zoomLevel * 5;

        if (userMarkerRef.current) {
          userMarkerRef.current.setIcon(myLocationIcon(iconSize));
        }
        if (searchedLocationMarkerRef.current) {
          searchedLocationMarkerRef.current.setIcon(
            searchedLocationByAddressIcon(iconSize)
          );
        }
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [
    hasMounted,
    location,
    searchedLocationByAddress,
    markUserLocation,
    zoomControl,
    zoom,
    helpingHandsLocations,
    token,
    user.id,
    mutation,
  ]);

  if (!hasMounted) {
    return null;
  }

  return (
    <div
      ref={mapContainerRef}
      style={style ?? { width: "100%", height: "100vh" }}
    />
  );
};

export default BaseMap;
