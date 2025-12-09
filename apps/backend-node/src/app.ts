import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { registerRoutes } from "./routes";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.frontendUrl || "*",
    })
  );
  app.use(express.json());
  app.use(requestLogger);

  registerRoutes(app);

  return app;
};
