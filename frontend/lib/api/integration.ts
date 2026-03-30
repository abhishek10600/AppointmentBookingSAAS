import { api } from "../axios";

export const connectGoogle = (organizationId: string) => {
  return `http://localhost:4000/api/v1/google/connect?organizationId=${organizationId}`;
};

export const checkGoogleStatus = async (organizationId: string) => {
  const res = await api.get(`/google/status?organizationId=${organizationId}`);
  return res.data.data;
};
