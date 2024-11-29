import axios from "axios";

export const backendURL = axios.create({
  baseURL: "http://localhost:8080/",
});

export const setAuth = async (token) => {
  // backendURL.defaults.headers.common["Authorization"] = `Basic ${token}`;
  backendURL.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
