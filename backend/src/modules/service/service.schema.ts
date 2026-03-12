import { z } from "zod";

export const createServiceSchema = z
  .object({
    organizationId: z.uuid(),
    title: z.string().min(5, "Title must be atleast 5 characters long"),
    description: z
      .string()
      .min(5, "Description must be at least 5 characters long"),
    serviceType: z.enum(["ONLINE", "OFFLINE"]),
    durationInMinutes: z.number().min(5).max(720),
    price: z.number().min(0),
    currency: z.string().length(3),
    locationAddress: z.string().optional(),
  })
  .strict();

export const updateServiceSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be atleast 5 characters long")
    .optional(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .optional(),
  durationInMinutes: z.number().min(5).max(720).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  locationAddress: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type createServiceData = z.infer<typeof createServiceSchema>;
export type updateServiceData = z.infer<typeof updateServiceSchema>;
