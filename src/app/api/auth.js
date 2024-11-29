import { backendURL } from "./axios";

export const login = async (token) => {
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
    throw error;
  }
};

export const register = async (user) => {
  try {
    const response = await backendURL.post("users/create", {
      ...user,
      typeId: 1,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
