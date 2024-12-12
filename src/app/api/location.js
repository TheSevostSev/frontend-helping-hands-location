import { backendURL } from "./axios";

export const createLocation = async (location) => {
  try {
    const response = await backendURL.post("locations", location);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListLocations = async () => {
  try {
    const response = await backendURL.get("locations");
    return response.data;
  } catch (error) {
    throw error;
  }
};
