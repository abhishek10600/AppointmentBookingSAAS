import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/lib/api/auth";
import { tokenService } from "@/lib/auth-token";
import { IUser } from "@/types";
import { LoginUserFormData, RegisterUserFormData } from "@/lib/validators/auth";

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

// Fetch current user
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await authApi.getMe();
  return res.user;
});

export const loginUserThunk = createAsyncThunk<
  any,
  LoginUserFormData,
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.login(data);

    // store token
    tokenService.setToken(res.token);

    return res;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Invalid email or password",
    );
  }
});

export const registerUserThunk = createAsyncThunk<
  any,
  RegisterUserFormData,
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.register(data);

    tokenService.setToken(res.token);

    return res.user;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Registration failed",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      tokenService.clearToken();
      state.user = null;
      state.isAuthenticated = false;
    },

    // resolves loading when no token
    setAuthResolved: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
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

      // Login
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      // Register
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, setAuthResolved } = authSlice.actions;
export default authSlice.reducer;
