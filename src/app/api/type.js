import { backendURL } from "./axios";

export const getListUserTypes = async () => {
  try {
    const response = await backendURL.get("login");
    return response.data;
  } catch (error) {
    throw error;
  }
};
