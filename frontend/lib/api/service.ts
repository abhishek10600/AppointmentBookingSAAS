import { IService } from "@/types";
import { api } from "../axios";
import {
  createServiceFormData,
  updateServiceFormData,
} from "../validators/service";

export const serviceApi = {
  create: async (data: createServiceFormData) => {
    const res = await api.post("/service", data);
    return res.data.data as IService;
  },

  getServiceByOrg: async (orgId: string) => {
    const res = await api.get(`/service/organization/${orgId}`);
    return res.data.data as IService[];
  },

  update: async (serviceId: string, data: updateServiceFormData) => {
    const res = await api.patch(`/service/${serviceId}`, data);
    return res.data.data;
  },

  delete: async (serviceId: string) => {
    await api.delete(`/service/${serviceId}`);
  },
};
