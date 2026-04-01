import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import crypto from "crypto";
import { ApiError } from "../../utils/ApiError.js";
import { prisma } from "../../lib/prisma.js";

export const handleWebHook = catchAsync(async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(req.body);

  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    throw new ApiError(400, "Invalid signature");
  }

  const body = JSON.parse(req.body.toString());

  // console.log("Webhook hit");
  // console.log("Signature:", req.headers["x-razorpay-signature"]);
  // console.log("Event:", body.event);

  const event = body.event;
  const payload = body.payload;

  if (event === "subscription.activated") {
    const sub = payload.subscription.entity;

    await prisma.organization.update({
      where: {
        subscriptionId: sub.id,
      },
      data: {
        plan: "PRO",
        subscriptionStatus: "ACTIVE",
        currentPeriodEnd: new Date(sub.current_end * 1000),
      },
    });
  }

  if (event === "subscription.cancelled") {
    const sub = payload.subscription.entity;

    await prisma.organization.update({
      where: {
        subscriptionId: sub.id,
      },
      data: {
        plan: "FREE",
        subscriptionStatus: "CANCELLED",
      },
    });
  }

  return res.status(200).json({
    status: "ok",
  });
});
