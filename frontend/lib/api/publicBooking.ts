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

  createOrder: async (data: { serviceId: string; startTime: string }) => {
    const res = await api.post(`/payment/create-order`, data);
    return res.data.data;
  },

  verifyPayment: async (data: any) => {
    const res = await api.post(`/payment/verify`, data);
    return res.data.data;
  },
};
