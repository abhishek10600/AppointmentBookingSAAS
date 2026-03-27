import { api } from "../axios";
import {
  publicBookingFormData,
  publicBookingSchema,
} from "../validators/publicBooking";

export const publicBookingApi = {
  getOrganizationBySlug: async (slug: string) => {
    const res = await api.get(`/organization/${slug}`);
    return res.data.data;
  },

  getServices: async (organizationId: string) => {
    const res = await api.get(`/service/public/${organizationId}`);
    return res.data.data;
  },

  getSlots: async (serviceId: string, date: string) => {
    const res = await api.get(`/slot`, {
      params: {
        serviceId,
        date,
      },
    });

    return res.data.data;
  },

  createBooking: async (data: publicBookingFormData) => {
    const parsed = publicBookingSchema.parse(data);
    const res = await api.post(`/booking`, parsed);
    return res.data.data;
  },
};
