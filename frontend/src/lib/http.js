import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default http;
