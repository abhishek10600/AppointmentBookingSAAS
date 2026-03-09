import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export default app;
