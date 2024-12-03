import axios from "axios";
import useTokenStore from "@/stores/useTokenStore";

export const backendURL = axios.create({
  baseURL: "http://localhost:8080/",
});

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
