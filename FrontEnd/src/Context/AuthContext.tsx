import { createContext, type SetStateAction } from "react";
import type { IUser } from "./AuthProvider";
import type { AxiosResponse } from "axios";

type AuthContext = {
  authUser: IUser | null;
  loading: boolean;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>;
  setAuthUser: React.Dispatch<SetStateAction<IUser | null>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setIsCheckingAuth: React.Dispatch<SetStateAction<boolean>>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<AxiosResponse | null>;
  logIn: (email: string, password: string) => Promise<AxiosResponse | null>;
  logOut: () => Promise<AxiosResponse | null>;
  verifyEmail: (code: string) => Promise<AxiosResponse | null>;
  checkAuth: () => Promise<AxiosResponse | null>;
  forgotPassword: (email: string) => Promise<AxiosResponse | null>;
  resetPassword: (
    token: string,
    password: string,
  ) => Promise<AxiosResponse | null>;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);
