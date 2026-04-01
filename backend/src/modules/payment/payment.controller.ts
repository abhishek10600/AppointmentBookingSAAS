import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createOrderService,
  createSubscriptionService,
  verifyPaymentService,
} from "./payment.service.js";

export const createOrderController = catchAsync(
  async (req: Request, res: Response) => {
    const { serviceId, startTime } = req.body;

    const order = await createOrderService(serviceId, startTime);

    return res.status(201).json({
      success: true,
      data: order,
    });
  }
);

export const verifyPaymentController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await verifyPaymentService(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);

export const createSubscriptionController = catchAsync(
  async (req: Request, res: Response) => {
    const { organizationId } = req.body;
    const subscription = await createSubscriptionService(organizationId);
    return res.status(201).json({
      success: true,
      data: subscription,
    });
  }
);
