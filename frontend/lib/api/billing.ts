import { api } from "../axios";

export const billingApi = {
  createSubscription: async (organizationId: string) => {
    const res = await api.post(`/payment/create-subscription`, {
      organizationId,
    });

    return res.data.data;
  },
};
