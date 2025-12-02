import axios from "axios";

// Remove trailing slash from backend URL if present
const backendURL = import.meta.env.VITE_BACKEND?.replace(/\/$/, '') || '';
const baseURL = `${backendURL}/api`;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
