import { backendURL } from "./axios";

export const createLocation = async (location) => {
  try {
    const response = await backendURL.post("locations", location);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLocation = async (locationId) => {
  try {
    const response = await backendURL.delete(`locations/${locationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListLocations = async (locationTagIds) => {
  try {
    const response = await backendURL.get(`locations?tagIds=${locationTagIds}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
