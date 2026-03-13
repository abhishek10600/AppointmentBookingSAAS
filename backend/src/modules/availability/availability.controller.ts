import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createAvailabilitySchema } from "./availability.schema.js";
import {
  createAvailablityRule,
  deleteAvailabilityRule,
  getAvailabilityRules,
} from "./availability.service.js";

export const createAvailablityRuleController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const data = createAvailabilitySchema.parse(req.body);

    console.log({ data });

    const rule = await createAvailablityRule(data, userId);

    return res.status(201).json({
      success: true,
      data: rule,
    });
  }
);

export const getAvailabilityRulesController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const organizationId = req.params.organizationId as string;

    const rules = await getAvailabilityRules(organizationId, userId);

    return res.status(200).json({
      success: true,
      data: rules,
    });
  }
);

export const deleteAvailabilityRuleController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const ruleId = req.params.ruleId as string;

    const result = await deleteAvailabilityRule(ruleId, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);
