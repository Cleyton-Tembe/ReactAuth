import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectionDB from "./db/mongo.ts";
import { config } from "dotenv";
import authRoutes from "./routes/auth.ts";
import { verify } from "./config/mailconfig.ts";

config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send(`<p>hello ${req.host}</p>`);
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("listening:", PORT);
  connectionDB();
  verify();
});
