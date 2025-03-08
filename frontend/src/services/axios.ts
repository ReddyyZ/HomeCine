import axios from "axios";

export const baseURL = "/api";

const apiClient = axios.create({
  baseURL,
  validateStatus: () => true,
});

export default apiClient;
