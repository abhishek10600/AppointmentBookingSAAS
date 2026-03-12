import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createServiceSchema, updateServiceSchema } from "./service.schema.js";
import {
  createService,
  deleteService,
  getActiveServices,
  getOrganizationServices,
  getServiceById,
  updateService,
} from "./service.service.js";

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

export const getOrganizationServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const orgId = req.params.orgId as string;

    const services = await getOrganizationServices(orgId, userId);

    return res.status(200).json({
      success: true,
      data: services,
    });
  }
);

export const getServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const serviceId = req.params.serviceId as string;

    const service = await getServiceById(serviceId, userId);

    return res.status(200).json({
      success: true,
      data: service,
    });
  }
);

export const getOrganizationActiveServicesController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const orgId = req.params.orgId as string;

    const activeServices = await getActiveServices(orgId, userId);

    return res.status(200).json({
      success: true,
      data: activeServices,
    });
  }
);

export const updateServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const serviceId = req.params.serviceId as string;
    const data = updateServiceSchema.parse(req.body);

    const updatedService = await updateService(serviceId, data, userId);

    return res.status(200).json({
      success: true,
      data: updatedService,
    });
  }
);

export const deleteServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const serviceId = req.params.serviceId as string;

    const result = await deleteService(serviceId, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);
