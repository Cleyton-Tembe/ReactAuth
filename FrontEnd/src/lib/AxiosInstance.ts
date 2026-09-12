import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api/auth"
    : "/api/auth";

export const AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});
