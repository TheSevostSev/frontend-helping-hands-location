import { backendURL } from "./axios";
export const list = async (token) => {
  try {
    const response = await backendURL.post(
      "login",
      {},
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
