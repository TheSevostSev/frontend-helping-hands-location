import { backendURL } from "./axios";

export const basicLogin = async (token) => {
  try {
    const response = await backendURL.post(
      "auth/basic/login",
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

export const basicRegister = async (user) => {
  try {
    const response = await backendURL.post("auth/basic/register", user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendGoogleToken = async (token) => {
  try {
    const response = await backendURL.post("/auth/google", { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};
