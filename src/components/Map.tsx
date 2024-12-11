"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import React from "react";
import "leaflet/dist/leaflet.css";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

interface MapProps {
  markUserLocation?: boolean | null;
  searchedLocationByAddress?: Coordinates | null;
  zoomControl: boolean;
  style?: object;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({
  markUserLocation,
  searchedLocationByAddress,
  zoomControl,
  style,
  zoom,
}) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

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

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
        zoomControl,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );

      if (markUserLocation) {
        userMarkerRef.current = L.marker(
          [location.latitude, location.longitude],
          {
            icon: myLocationIcon(30),
          }
        ).addTo(mapRef.current);
      }

      if (
        searchedLocationByAddress?.longitude &&
        searchedLocationByAddress?.latitude
      ) {
        searchedLocationMarkerRef.current = L.marker(
          [location.latitude, location.longitude],
          {
            icon: searchedLocationByAddressIcon(30),
          }
        ).addTo(mapRef.current);
      }

      mapRef.current.on("zoomend", () => {
        const zoomLevel = mapRef.current ? mapRef.current.getZoom() : 13;
        const iconSize = Math.max(20, zoomLevel * 2);
        if (userMarkerRef.current) {
          userMarkerRef.current.setIcon(myLocationIcon(iconSize));
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
    location,
    hasMounted,
    searchedLocationByAddress?.latitude,
    markUserLocation,
    searchedLocationByAddress?.longitude,
    zoomControl,
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

export default Map;
