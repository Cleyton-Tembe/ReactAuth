import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const useAuth = () => {
  const authStore = useContext(AuthContext);

  if (authStore) {
    return authStore;
  }

  throw new Error("Context is not inicialiazed or lost it!");
};
