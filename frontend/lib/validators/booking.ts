import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  serviceId: z.string(),

  customerName: z.string(),
  customerEmail: z.email(),
  customerPhone: z.string().optional(),

  startTime: z.string(),
  endTime: z.string(),

  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),

  service: z
    .object({
      id: z.string(),
      title: z.string(),
    })
    .optional(),
});

export const bookingArraySchema = z.array(bookingSchema);

export const createBookingSchema = z.object({
  serviceId: z.uuid(),
  organizationId: z.uuid(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string().optional(),
  startTime: z.string(),
});

export type IBooking = z.infer<typeof bookingSchema>;
export type createBookingFormData = z.infer<typeof createBookingSchema>;
