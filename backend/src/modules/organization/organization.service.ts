import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { cache } from "../../utils/cache.js";

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

  await cache.del(`org:userId:${userId}`);

  return organization;
};

export const getMyOrganizations = async (userId: string) => {
  const cacheKey = `org:userId:${userId}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log("Cache HIT");
    // console.log({ cached });
    return cached;
  }

  console.log("Cache MISS");

  const organizations = await prisma.organization.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await cache.set(cacheKey, organizations, 300);

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
