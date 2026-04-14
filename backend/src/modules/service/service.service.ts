import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { createServiceData, updateServiceData } from "./service.schema.js";
import { cache } from "../../utils/cache.js";

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

  await cache.del(`service:organizationId:${organization.id}`);

  return service;
};

export const getOrganizationServices = async (
  organizationId: string,
  userId: string
) => {
  const cacheKey = `service:organizationId:${organizationId}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log("Cache HIT");
    return cached;
  }

  console.log("Cache MISS");

  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
      ownerId: userId,
    },
  });

  if (!organization) {
    throw new ApiError(403, "Access Denied");
  }

  const services = await prisma.service.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await cache.set(cacheKey, services, 300);

  return services;
};

export const getActiveServices = async (
  organizationId: string,
  userId: string
) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
      ownerId: userId,
    },
  });

  if (!organization) {
    throw new ApiError(403, "Access Denied");
  }

  const activeServices = await prisma.service.findMany({
    where: {
      organizationId,
      isActive: true,
    },
  });

  return activeServices;
};

export const getServiceById = async (serviceId: string, userId: string) => {
  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      Organization: {
        ownerId: userId,
      },
    },
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

export const updateService = async (
  serviceId: string,
  data: updateServiceData,
  userId: string
) => {
  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      Organization: {
        ownerId: userId,
      },
    },
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const updatedService = await prisma.service.update({
    where: {
      id: service.id,
    },
    data,
  });

  await cache.del(`service:organizationId:${service.organizationId}`);

  return updatedService;
};

export const deleteService = async (serviceId: string, userId: string) => {
  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      Organization: {
        ownerId: userId,
      },
    },
  });

  if (!service) {
    throw new ApiError(403, "Service not found.");
  }

  await prisma.service.delete({
    where: {
      id: serviceId,
    },
  });

  await cache.del(`service:organizationId:${service.organizationId}`);

  return { message: "Service deleted successfully." };
};

export const getPublicServicesByOrgId = async (organizationId: string) => {
  return await prisma.service.findMany({
    where: {
      organizationId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
