import { backendURL } from "./axios";

export const currentUser = async () => {
  try {
    const response = await backendURL.get("users/current-user");
    return response.data;
  } catch (error) {
    throw error;
  }
};
