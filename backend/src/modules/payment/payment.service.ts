import { prisma } from "../../lib/prisma.js";
import { razorpay } from "../../lib/razorpay.js";
import { ApiError } from "../../utils/ApiError.js";
import crypto from "crypto";
import { createBooking } from "../booking/booking.service.js";

export const createOrderService = async (
  serviceId: string,
  startTime: string
) => {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      Organization: true,
    },
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + service.durationInMinutes * 60000);

  const existingBooking = await prisma.booking.findFirst({
    where: {
      serviceId,
      status: { not: "CANCELLED" },
      AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
    },
  });

  if (existingBooking) {
    throw new ApiError(400, "Slot already booked");
  }

  const existingLock = await prisma.bookingLock.findFirst({
    where: {
      serviceId,
      AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
    },
  });

  if (existingLock) {
    throw new ApiError(400, "Slot is locked by another user");
  }

  await prisma.bookingLock.create({
    data: {
      serviceId,
      startTime: start,
      endTime: end,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const price = service.price;
  let platFormFee = 0;

  if (service.Organization.plan === "FREE") {
    platFormFee = Math.round(price * 0.08);
  }

  const totalAmount = price + platFormFee;

  const order = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: service.currency,
    receipt: `receipt_${Date.now()}`,
  });

  const orderResult = {
    order,
    price,
    platFormFee,
    totalAmount,
  };

  return orderResult;
};

export const verifyPaymentService = async (data: any) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData,
  } = data;

  const existingPayment = await prisma.payment.findUnique({
    where: {
      providerPaymentId: razorpay_payment_id,
    },
  });

  if (existingPayment) {
    return existingPayment;
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  console.log({ generatedSignature });
  console.log({ razorpay_signature });

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // console.log("we are here");

  const result = await prisma.$transaction(async (tx) => {
    const booking = await createBooking(bookingData, tx);

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        organizationId: booking.organizationId,
        amount: booking.service.price,
        currency: booking.service.currency,
        status: "SUCCESS",
        provider: "RAZORPAY",
        providerPaymentId: razorpay_payment_id,
      },
    });

    await tx.bookingLock.deleteMany({
      where: {
        serviceId: booking.serviceId,
        startTime: booking.startTime,
      },
    });

    return booking;
  });

  return result;
};

export const createSubscriptionService = async (organizationId: string) => {
  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID!,
    customer_notify: 1,
    total_count: 12,
  });

  console.log({ subscription });

  await prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: "INACTIVE",
    },
  });

  return subscription;
};
