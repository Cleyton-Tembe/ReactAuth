import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signUp,
  verifyEmail,
} from "../controllers/auth.ts";
import protectToken from "../middleware/verifyToken.ts";

const authRoutes = Router();

authRoutes.get("/protect", protectToken);
authRoutes.post("/register", signUp);
authRoutes.post("/verify", verifyEmail);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:token", resetPassword);
authRoutes.get("/logout", logout);

export default authRoutes;
