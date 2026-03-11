import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createOrganization = async (
  userId: string,
  name: string,
  slug: string,
  timezone: string
) => {
  const existing = await prisma.organization.findUnique({
    where: {
      slug,
    },
  });

  if (existing) {
    throw new ApiError(400, "Slug already taken");
  }

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
      timezone,
      ownerId: userId,
    },
  });

  return organization;
};

export const getMyOrganizations = async (userId: string) => {
  const organizations = await prisma.organization.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return organizations;
};

export const getOrganizationBySlug = async (slug: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      slug,
    },
  });

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  return organization;
};
