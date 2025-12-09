import { Router, Request, Response } from "express";
import { ApiResponse } from "@mono-repo/shared-types";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const response: ApiResponse<string> = {
    success: true,
    message: "Express API is running!",
    data: "Welcome to the backend API",
  };
  res.json(response);
});

export { router as rootRouter };
