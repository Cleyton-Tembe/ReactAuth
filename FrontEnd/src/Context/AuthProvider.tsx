import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { AxiosInstance } from "../lib/AxiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export interface IUser {
  email: string;
  name: string;
  password: string;
  lastLogin?: Date | undefined;
  isVerified: boolean;
  resetPasswordToken?: string | undefined;
  resetPasswordExperiresAt?: Date | undefined;
  verificationToken?: string | undefined;
  verificationTokenExpiresAt?: Date | undefined;
  createdAt: Date | undefined;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/register", {
        email,
        name,
        password,
      });

      console.log("response from the server", response);

      if (response.status === 201) {
        setAuthUser(response.data.user);
        setIsAuthenticated(true);
      }
      console.log("server response", response);
      return response;
    } catch (error) {
      if (error.response.data.message) {
        toast.error(`${error.response.data.message}`);
      }
      console.log("signUp: ", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/login", {
        email,
        password,
      });

      if (response.status === 200) {
        setAuthUser(response.data.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      if (error.response.data.message) {
        toast.error(`${error.response.data.message}`);
      }
      console.log("logIn: ", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/logout");

      if (response.status === 200) {
        setAuthUser(null);
        setIsAuthenticated(false);
        toast.success(response.data.message);
      }

      return response;
    } catch (error) {
      console.log("logOut: ", error);
      return null;
    } finally {
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/verify", {
        code,
      });

      if (response.status === 200) {
        setAuthUser(response.data.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      console.log("verifyEmail: ", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      setIsCheckingAuth(true);
      const response = await AxiosInstance.get("/protect");
      console.log("response: ", response);
      if (response) {
        if (response.status === 200) {
          setAuthUser(response.data.userFound);
          setIsAuthenticated(true);
          toast.success(`Welcome ${response.data.userFound.name}`);
        } else {
          toast.error("Server answered and you failed");
        }
      }
      return response;
    } catch (error) {
      if (error.response) {
        console.log("checkAuth: ", error.response.data.message);
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
        navigate("/login", { replace: true });
      }
      console.log("checkAuth: ", error);
      return null;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/forgot-password", { email });

      return response;
    } catch (error) {
      if (error.response) {
        console.error("error response: ", error.response.data.message);
      } else {
        console.log("forgotPassword: ", error);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post(`/reset-password/${token}`, {
        token,
        password,
      });

      return response;
    } catch (error) {
      console.log("resetPassword: ", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        loading,
        isCheckingAuth,
        setAuthUser,
        isAuthenticated,
        setIsAuthenticated,
        setIsCheckingAuth,
        setLoading,
        signUp,
        logIn,
        logOut,
        verifyEmail,
        checkAuth,
        forgotPassword,
        resetPassword,
      }}
    >
      <Toaster position="top-center" />
      {children}
    </AuthContext.Provider>
  );
}
