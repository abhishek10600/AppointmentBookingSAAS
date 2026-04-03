import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  handleWebHook
);

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
import availabilityRuleRouter from "./modules/availability/availability.route.js";
import slotRouter from "./modules/slot/slot.route.js";
import bookingRouter from "./modules/booking/booking.route.js";
import googleRouter from "./modules/google/google.route.js";
import { googleCallback } from "./modules/google/google.controller.js";
import paymentRouter from "./modules/payment/payment.route.js";
import { handleWebHook } from "./modules/payment/payment.webhook.js";
import bankRouter from "./modules/bank/bank.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organization", orgRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/availability", availabilityRuleRouter);
app.use("/api/v1/slot", slotRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/google", googleRouter);
app.use("/auth/google/callback", googleCallback);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/bank", bankRouter);

app.use(errorHandler);

export default app;
