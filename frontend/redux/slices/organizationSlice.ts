import { organizationApi } from "@/lib/api/organization";
import { OrganizationFormData } from "@/lib/validators/organization";
import { IOrganization } from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface OrgState {
  organizations: IOrganization[];
  currentOrgId: string | null;
  isLoading: boolean;
}

const initialState: OrgState = {
  organizations: [],
  currentOrgId: null,
  isLoading: false,
};

export const fetchOrganizations = createAsyncThunk("org/fetch", async () => {
  return await organizationApi.getMyOrganization();
});

export const createOrganizationThunk = createAsyncThunk(
  "org/create",
  async (data: OrganizationFormData) => {
    return await organizationApi.create(data);
  },
);

const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    setCurrentOrg: (state, action) => {
      state.currentOrgId = action.payload;
      localStorage.setItem("orgId", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.organizations = action.payload;

        const savedOrgId =
          typeof window !== "undefined" ? localStorage.getItem("orgId") : null;

        if (savedOrgId && action.payload.some((o) => o.id === savedOrgId)) {
          state.currentOrgId = savedOrgId;
        } else if (action.payload.length > 0) {
          state.currentOrgId = action.payload[0].id;
        }
      })
      .addCase(createOrganizationThunk.fulfilled, (state, action) => {
        state.organizations.push(action.payload);
      });
  },
});

export const { setCurrentOrg } = orgSlice.actions;
export default orgSlice.reducer;
