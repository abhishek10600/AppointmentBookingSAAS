import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { createServiceData } from "./service.schema.js";

export const createService = async (
  data: createServiceData,
  userId: string
) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: data.organizationId,
    },
  });

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  if (organization.ownerId !== userId) {
    throw new ApiError(403, "You are not allowed to perform this operation.");
  }

  if (data.serviceType === "OFFLINE" && !data.locationAddress) {
    throw new ApiError(400, "Location address required for offline service");
  }

  const service = await prisma.service.create({
    data: {
      organizationId: data.organizationId,
      title: data.title,
      description: data.description,
      serviceType: data.serviceType,
      durationInMinutes: data.durationInMinutes,
      price: data.price,
      currency: data.currency,
      locationAddress: data.locationAddress,
    },
  });

  return service;
};
