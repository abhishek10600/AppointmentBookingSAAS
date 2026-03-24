import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orgReducer from "./slices/organizationSlice";
import serviceReducer from "./slices/serviceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    service: serviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
