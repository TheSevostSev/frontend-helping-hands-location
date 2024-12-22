/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Select } from "antd";

interface SelectLocationByAddressProps {
  setLocation: (location: HelpingHandsLocationForm) => void;
  location: HelpingHandsLocationForm;
}

const L = typeof window !== "undefined" ? require("leaflet") : null;
const Geocoder =
  typeof window !== "undefined" ? require("leaflet-control-geocoder") : null;

const { Option } = Select;

const SelectLocationByAddress: React.FC<SelectLocationByAddressProps> = ({
  location,
  setLocation,
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [geocoder, setGeocoder] = useState<L.Control.Geocoder | null>(null);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      const geocoderInstance = L.Control.Geocoder.nominatim();
      setGeocoder(geocoderInstance);
    }
  }, []);

  const handleSearch = (searchAddress: string) => {
    if (!searchAddress || !geocoder) return;

    const timeout = setTimeout(() => {
      console.warn("Geocoder timeout");
    }, 5000);

    geocoder.geocode(searchAddress, (results: any[]) => {
      clearTimeout(timeout);
      setResults(results);
    });
  };

  const debounceSearch = (searchAddress: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchAddress == "") {
      searchAddress = "Barcelona";
    }

    debounceTimer.current = window.setTimeout(() => {
      handleSearch(searchAddress);
    }, 500);
  };

  const handleSelect = (value: string, option: any) => {
    const { lat, lng } = option.data.center;
    setLocation({
      ...location,
      latitude: lat,
      longitude: lng,
      address: option.data.name,
    });
    setResults([]);
  };

  return (
    <div>
      <Select
        showSearch
        placeholder="Selecciona una ubicacion"
        value={location?.address}
        onClick={() => debounceSearch("")}
        onSearch={(value) => debounceSearch(value)}
        onSelect={handleSelect}
        style={{ width: 300, marginBottom: 10 }}
        filterOption={false}
      >
        {results.map((result, index) => (
          <Option key={index} value={result.name} data={result}>
            {result.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectLocationByAddress;
