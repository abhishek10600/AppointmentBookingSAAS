import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orgReducer from "./slices/organizationSlice";
import serviceReducer from "./slices/serviceSlice";
import availabilityReducer from "./slices/availabilitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    service: serviceReducer,
    availability: availabilityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
