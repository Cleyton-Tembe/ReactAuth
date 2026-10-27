import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectionDB from "./db/mongo.ts";
import { config } from "dotenv";
import authRoutes from "./routes/auth.ts";
import { verify } from "./config/mailconfig.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

config();

const PORT = process.env.PORT || 4000;
const app = express();

// Directório real do ficheiro compilado: BackEnd/dist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho absoluto para o frontend compilado
const frontendPath = path.resolve(__dirname, "../../FrontEnd/dist");
const indexPath = path.join(frontendPath, "index.html");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://reactauth-tu5b.onrender.com"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Rotas da API
app.use("/api/auth", authRoutes);

// Resposta para endpoints de API inexistentes
app.use("/api", (req: Request, res: Response) => {
  res.status(404).json({
    message: "API route not found",
  });
});

if (process.env.NODE_ENV === "production") {
  console.log("Current working directory:", process.cwd());
  console.log("Backend directory:", __dirname);
  console.log("Frontend directory:", frontendPath);
  console.log("Index exists:", fs.existsSync(indexPath));

  // Servir ficheiros JS, CSS e outros assets do Vite
  app.use(express.static(frontendPath));

  // Evitar que ficheiros inexistentes recebam HTML
  app.use("/assets", (req: Request, res: Response) => {
    res.status(404).send("Asset not found");
  });

  // React Router: devolver index.html nas rotas da aplicação
  app.get("/{*splat}", (req: Request, res: Response) => {
    res.sendFile(indexPath);
  });

  console.log("Production ready");
}

app.listen(PORT, () => {
  console.log("Listening:", PORT);
  connectionDB();
  verify();
});
