import { backendURL } from "./axios";

export const createLocation = async (location) => {
  try {
    const response = await backendURL.post("locations", location);
    return response.data;
  } catch (error) {
    throw error;
  }
};
