import { Router, Request, Response } from "express";
import { ApiResponse, HealthCheck } from "@mono-repo/shared-types";
import { env } from "../config/env";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const response: ApiResponse<HealthCheck> = {
    success: true,
    data: {
      status: "healthy",
      service: env.serviceName,
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

export { router as healthRouter };
