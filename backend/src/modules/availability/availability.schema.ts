import { z } from "zod";

export const createAvailabilitySchema = z.object({
  organizationId: z.uuid(),
  dayofWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
});

export type createAvailabilityData = z.infer<typeof createAvailabilitySchema>;
