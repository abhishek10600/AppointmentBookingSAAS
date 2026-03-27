import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { bookingApi } from "@/lib/api/booking";
import { IBooking } from "@/lib/validators/booking";

interface BookingState {
  bookings: IBooking[];
  isLoading: boolean;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
};

export const fetchBookings = createAsyncThunk<
  IBooking[],
  string,
  { rejectValue: string }
>("booking/fetch", async (orgId, { rejectWithValue }) => {
  try {
    return await bookingApi.getBookingByOrganization(orgId);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch bookings");
  }
});

export const cancelBookingThunk = createAsyncThunk<
  IBooking,
  string,
  { rejectValue: string }
>("Booking/cancel", async (bookingId, { rejectWithValue }) => {
  try {
    return await bookingApi.cancel(bookingId);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to cancel booking");
  }
});

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBookings.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );

        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export default bookingSlice.reducer;
