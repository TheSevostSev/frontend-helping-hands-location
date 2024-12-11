import { backendURL } from "./axios";

export const getListLocationTags = async () => {
  try {
    const response = await backendURL.get("tags");
    return response.data;
  } catch (error) {
    throw error;
  }
};
