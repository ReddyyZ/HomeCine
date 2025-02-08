import React, { useContext, createContext } from "react";
import { login, loginProps } from "../services/apiClient";

interface ProviderProps {
  user: string | null;
  login(data: loginProps): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({
  user: null,
  login: async () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");

  const loginFunc = async (data: loginProps) => {
    const result = await login(data);
    if (!result.data) {
      return;
    }
    if (result.data.success) {
      localStorage.setItem("user", result.data.user);
    } else {
      console.log(result.data.error);
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
