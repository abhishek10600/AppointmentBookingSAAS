import { api } from "../axios";
import { createAvailabilityFormData } from "../validators/availability";

export const availabilityApi = {
  getOrgById: async (orgId: string) => {
    const res = await api.get(`/availability/${orgId}`);
    return res.data.data;
  },

  create: async (data: createAvailabilityFormData) => {
    const res = await api.post(`/availability`, data);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/availability/${id}`);
    return res.data.data;
  },
};
