import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/lib/api/auth";
import { tokenService } from "@/lib/auth-token";
import { IUser } from "@/types";
import { LogOut } from "lucide-react";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// init user
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await authApi.getMe();
  return res.user;
});

// login user
export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const res = await authApi.login(data);
    tokenService.setToken(res.token);
    return res.user;
  },
);

// register user
export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }) => {
    const res = await authApi.register(data);
    tokenService.setToken(res.token);
    return res.user;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      tokenService.clearToken();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        tokenService.clearToken();
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
