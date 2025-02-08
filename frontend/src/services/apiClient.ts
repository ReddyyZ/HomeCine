import { AxiosError, AxiosResponse } from "axios";
import apiClient from "./axios";

export type LoginProps = {
  email: string;
  password: string;
};

export type registerProps = {
  name: string;
  email: string;
  password: string;
};

export function login(data: LoginProps) {
  return apiClient.post("/login", data);
}
