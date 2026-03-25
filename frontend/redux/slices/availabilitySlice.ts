import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { availabilityApi } from "@/lib/api/availability";

import {
  createAvailabilityFormData,
  createAvailabilitySchema,
} from "@/lib/validators/availability";
import { IAvailability } from "@/types";

interface AvailabilityState {
  slots: IAvailability[];
  isLoading: boolean;
}

const initialState: AvailabilityState = {
  slots: [],
  isLoading: false,
};

// Fetch availability
export const fetchAvailability = createAsyncThunk<IAvailability[], string>(
  "availability/fetch",
  async (orgId) => {
    return await availabilityApi.getOrgById(orgId);
  },
);

export const createAvailabilityThunk = createAsyncThunk<
  IAvailability,
  createAvailabilityFormData,
  { rejectValue: string }
>("availability/create", async (data, { rejectWithValue }) => {
  try {
    const validatedData = createAvailabilitySchema.parse(data);

    return await availabilityApi.create(validatedData);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to create slot",
    );
  }
});

// Delete availability
export const deleteAvailabilityThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("availability/delete", async (id, { rejectWithValue }) => {
  try {
    await availabilityApi.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete slot",
    );
  }
});

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAvailability.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.slots = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAvailability.rejected, (state) => {
        state.isLoading = false;
      })

      // CREATE
      .addCase(createAvailabilityThunk.fulfilled, (state, action) => {
        state.slots.push(action.payload);
      })

      // DELETE
      .addCase(deleteAvailabilityThunk.fulfilled, (state, action) => {
        state.slots = state.slots.filter((slot) => slot.id !== action.payload);
      });
  },
});

export default availabilitySlice.reducer;
