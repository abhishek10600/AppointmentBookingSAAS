import { z } from "zod";

export const createAvailabilitySchema = z
  .object({
    organizationId: z.string().uuid(),

    dayofWeek: z.number().min(0).max(6),

    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),

    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  })
  .superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time must be before end time",
        path: ["endTime"],
      });
    }
  });

export type createAvailabilityFormData = z.infer<
  typeof createAvailabilitySchema
>;
