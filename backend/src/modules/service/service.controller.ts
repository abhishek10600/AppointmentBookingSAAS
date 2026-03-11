import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createServiceSchema } from "./service.schema.js";
import { createService } from "./service.service.js";

export const createServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const data = createServiceSchema.parse(req.body);

    const userId = req.userId as string;

    const service = await createService(data, userId);

    return res.status(201).json({
      success: true,
      data: service,
    });
  }
);
