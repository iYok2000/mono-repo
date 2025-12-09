import { Application } from "express";
import { rootRouter } from "./root";
import { healthRouter } from "./health";

export const registerRoutes = (app: Application) => {
  app.use("/", rootRouter);
  app.use("/health", healthRouter);
};
