import { api } from "../axios";
import {
  createBookingFormData,
  createBookingSchema,
} from "../validators/booking";

export const bookingApi = {
  create: async (data: createBookingFormData) => {
    const validated = createBookingSchema.parse(data);
    const res = await api.post("/booking", validated);
    return res.data.data;
  },

  getBookingByOrganization: async (organizationId: string) => {
    const res = await api.get(`/booking/organization/${organizationId}`);
    return res.data.data;
  },

  getBookingByService: async (serviceId: string) => {
    const res = await api.get(`/booking/service/${serviceId}`);
    return res.data.data;
  },

  cancel: async (bookingId: string) => {
    const res = await api.patch(`/booking/${bookingId}`);
    return res.data.data;
  },
};
