import axios from "axios";

export const baseURL = "http://localhost:8080";

const apiClient = axios.create({
  baseURL,
  validateStatus: () => true,
});

export default apiClient;
