import React, { useContext, createContext } from "react";
import { login, LoginProps } from "../services/apiClient";
import { AxiosResponse } from "axios";
interface ProviderProps {
  user: string | null;
  login(data: LoginProps): Promise<AxiosResponse | undefined>;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({} as ProviderProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");

  const loginFunc = async (data: LoginProps) => {
    try {
      const result = await login(data);
      if (!result) {
        return;
      }

      if (result.data.success) {
        localStorage.setItem("user", result.data.user);
      }

      return result;
    } catch (error) {
      return;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login: loginFunc,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
