import { api } from "../axios";
import { BankFormData } from "../validators/bank";

export const bankApiService = {
  upsertBankDetail: async (data: BankFormData) => {
    const res = await api.post(`/bank/`, data);
    return res.data.data;
  },
  getUserBankDetail: async () => {
    const res = await api.get(`/bank/`);
    return res.data.data;
  },
};
