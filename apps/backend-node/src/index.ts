import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HealthCheck, ApiResponse } from "@mono-repo/shared-types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  const response: ApiResponse<string> = {
    success: true,
    message: "Express API is running!",
    data: "Welcome to the backend API",
  };
  res.json(response);
});

app.get("/health", (req: Request, res: Response) => {
  const response: ApiResponse<HealthCheck> = {
    success: true,
    data: {
      status: "healthy",
      service: "backend-node",
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
