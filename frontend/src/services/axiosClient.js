import axios from "axios";

const baseURL = `${import.meta.env.VITE_BACKEND}/api`;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
