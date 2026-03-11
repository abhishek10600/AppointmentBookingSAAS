import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name cannot be empty"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be URL friendly"),
  timezone: z.string(),
});
