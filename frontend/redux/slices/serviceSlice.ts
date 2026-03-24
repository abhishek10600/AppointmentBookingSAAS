import { serviceApi } from "@/lib/api/service";
import {
  createServiceFormData,
  updateServiceFormData,
} from "@/lib/validators/service";
import { IService } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ServiceState {
  services: IService[];
  isLoading: boolean;
}

const initialState: ServiceState = {
  services: [],
  isLoading: false,
};

export const fetchServices = createAsyncThunk(
  "service/fetch",
  async (orgId: string) => {
    return await serviceApi.getServiceByOrg(orgId);
  },
);

export const createServiceThunk = createAsyncThunk(
  "service/create",
  async (data: createServiceFormData & { organizationId: string }) => {
    return await serviceApi.create(data);
  },
);

export const updateServiceThunk = createAsyncThunk(
  "service/update",
  async ({
    serviceId,
    data,
  }: {
    serviceId: string;
    data: updateServiceFormData;
  }) => {
    return await serviceApi.update(serviceId, data);
  },
);

export const deleteServiceThunk = createAsyncThunk(
  "service/delete",
  async (serviceId: string) => {
    await serviceApi.delete(serviceId);
    return serviceId;
  },
);

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      .addCase(createServiceThunk.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateServiceThunk.fulfilled, (state, action) => {
        const index = state.services.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(deleteServiceThunk.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s.id !== action.payload);
      });
  },
});

export default serviceSlice.reducer;
