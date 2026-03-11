import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS,
    credentials: true,
  })
);
app.use(cookieParser());

// health-check
app.get("/health-check", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    messsage: "health is fine",
  });
});

import authRouter from "./modules/auth/auth.route.js";
import orgRouter from "./modules/organization/organization.route.js";
import serviceRouter from "./modules/service/service.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organization", orgRouter);
app.use("/api/v1/service", serviceRouter);

app.use(errorHandler);

export default app;
