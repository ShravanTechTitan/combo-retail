// src/api/AxiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // this gets proxied to backend
  headers: { "Content-Type": "application/json" },
});

export default api;
