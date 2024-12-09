import { backendURL } from "./axios";

export const basicLogin = async (user) => {
  try {
    const response = await backendURL.post("auth/basic/login", {
      username: user.username,
      password: user.password,
    });
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
