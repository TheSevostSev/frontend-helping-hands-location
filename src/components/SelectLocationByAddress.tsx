/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
"use client"; // Ensure the component is treated as client-side only

import React, { useState, useEffect } from "react";
import { Select } from "antd";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

interface SelectLocationByAddressProps {
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates>>;
  eraseAddress: boolean | null;
}

// Dynamically load Leaflet-Control-Geocoder only on the client side
const L = typeof window !== "undefined" ? require("leaflet") : null;
const Geocoder =
  typeof window !== "undefined" ? require("leaflet-control-geocoder") : null;

const { Option } = Select;

const SelectLocationByAddress: React.FC<SelectLocationByAddressProps> = ({
  setCoordinates,
  eraseAddress,
}) => {
  const [address, setAddress] = useState<string>(""); // Address input state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]); // State for geocoding results
  const [geocoder, setGeocoder] = useState<L.Control.Geocoder | null>(null); // Geocoder state

  // Initialize geocoder only in the client-side
  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      const geocoderInstance = L.Control.Geocoder.nominatim();
      setGeocoder(geocoderInstance);
    }
  }, []);

  useEffect(() => {
    if (eraseAddress) {
      setAddress("");
    }
  }, [eraseAddress]);

  // Function to handle the search and geocode the address
  const handleSearch = (address: string) => {
    if (!address || !geocoder) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geocoder.geocode(address, (results: any[]) => {
      setResults(results);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (value: string, option: any) => {
    const { lat, lng } = option.data.center;
    setCoordinates({ latitude: lat, longitude: lng });
    setAddress(option.data.name);
    setResults([]);
  };

  return (
    <div>
      <Select
        showSearch
        placeholder="Select an address"
        value={address}
        onClick={() => handleSearch("Barcelona")}
        onSearch={(value) => handleSearch(value)}
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
