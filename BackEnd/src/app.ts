import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.ts";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://reactauth-6j7h-hh6xfkia5-team-sw.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api", (req: Request, res: Response) => {
  res.status(404).json({
    message: "API route not found",
  });
});

export default app;
