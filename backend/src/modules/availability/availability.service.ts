import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { createAvailabilityData } from "./availability.schema.js";

export const createAvailablityRule = async (
  data: createAvailabilityData,
  userId: string
) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: data.organizationId,
      ownerId: userId,
    },
  });

  if (!organization) {
    throw new ApiError(403, "Access Denied");
  }

  const rule = await prisma.availabilityRule.create({
    data: {
      organizationId: data.organizationId,
      dayofWeek: data.dayofWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });

  return rule;
};

export const getAvailabilityRules = async (
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

  const rules = await prisma.availabilityRule.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      dayofWeek: "asc",
    },
  });

  return rules;
};

export const deleteAvailabilityRule = async (
  ruleId: string,
  userId: string
) => {
  const rule = await prisma.availabilityRule.findFirst({
    where: {
      id: ruleId,
      organization: {
        ownerId: userId,
      },
    },
  });

  if (!rule) {
    throw new ApiError(404, "Rule not found");
  }

  await prisma.availabilityRule.delete({
    where: {
      id: ruleId,
    },
  });

  return {
    message: "Availability rule deleted",
  };
};
