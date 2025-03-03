import React, { useContext, createContext } from "react";
import {
  AdminLoginProps,
  login,
  LoginProps,
  register,
  RegisterProps,
  loginAdmin,
} from "../services/apiClient";
import { AxiosResponse } from "axios";
interface ProviderProps {
  user: string | null;
  admin: string | null;
  login(data: LoginProps): Promise<AxiosResponse | undefined>;
  register(data: RegisterProps): Promise<AxiosResponse | undefined>;
  adminLogin(data: AdminLoginProps): Promise<AxiosResponse | undefined>;
  logout(): void;
  logoutAdmin(): void;
}

const AuthContext = createContext<ProviderProps>({} as ProviderProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");

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

  const registerFunc = async (data: RegisterProps) => {
    try {
      const result = await register(data);
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

  const adminLogin = async (data: AdminLoginProps) => {
    try {
      const result = await loginAdmin(data);
      if (!result) {
        return;
      }

      console.log(result);

      if (result.data.success) {
        localStorage.setItem("admin", result.data.token);
      }

      return result;
    } catch (error) {
      return;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin";
  };

  const value = {
    user,
    admin,
    login: loginFunc,
    register: registerFunc,
    logout,
    adminLogin,
    logoutAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
