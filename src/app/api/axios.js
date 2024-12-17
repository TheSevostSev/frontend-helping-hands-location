import axios from "axios";
import useTokenStore from "@/stores/useTokenStore";

export const backendURL = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

backendURL.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL); // Debug log
