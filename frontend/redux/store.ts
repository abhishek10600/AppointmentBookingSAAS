import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orgReducer from "./slices/organizationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
