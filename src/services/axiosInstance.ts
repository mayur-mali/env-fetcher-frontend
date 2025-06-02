// src/services/axiosInstance.ts
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Unauthorized. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (status === 403) {
      toast.error("Forbidden. You don’t have access.");
    } else if (status >= 500) {
      toast.error("Server error. Try again later.");
    } else {
      toast.error(error.response?.data?.message || "An error occurred");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
