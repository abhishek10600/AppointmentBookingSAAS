import { api } from "../axios";
import {
  LoginUserFormData,
  RegisterUserFormData,
  ResetPasswordFormData,
} from "../validators/auth";

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

export const authApi = {
  register: async (data: RegisterUserFormData) => {
    const res = await api.post("/auth/register", data);
    return res.data.data as AuthResponse;
  },

  login: async (data: LoginUserFormData) => {
    const res = await api.post("/auth/login", data);
    return res.data.data as AuthResponse;
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data.data;
  },

  changePassword: async (data: ResetPasswordFormData) => {
    const res = await api.post("/auth/change-password", data);
    return res.data.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    const res = await api.post("/auth/reset-password-token", data);
    return res.data.data;
  },
};
