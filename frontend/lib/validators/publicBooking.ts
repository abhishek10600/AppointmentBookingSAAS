import { z } from "zod";

export const publicBookingSchema = z.object({
  serviceId: z.uuid(),
  organizationId: z.uuid(),
  customerName: z.string(),
  customerEmail: z.email(),
  customerPhone: z.string().optional(),
  startTime: z.string(),
});

export type publicBookingFormData = z.infer<typeof publicBookingSchema>;
