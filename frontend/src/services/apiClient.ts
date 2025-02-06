import apiClient from "./axios";

export type loginProps = {
  email: string;
  password: string;
};

export type registerProsp = {
  name: string;
  email: string;
  password: string;
};

export function login(data: loginProps) {
  return apiClient.post("/login", data);
}
