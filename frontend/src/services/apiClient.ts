import apiClient from "./axios";

export type LoginProps = {
  email: string;
  password: string;
};

export type RegisterProps = {
  name: string;
  email: string;
  password: string;
};

export function login(data: LoginProps) {
  return apiClient.post("/login", data);
}

export function register(data: RegisterProps) {
  return apiClient.post("/register", data);
}

export function getMovies(user: string) {
  return apiClient.get("/movies", {
    headers: {
      Authorization: user,
    },
  });
}
