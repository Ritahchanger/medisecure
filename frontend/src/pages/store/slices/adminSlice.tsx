import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import adminApi from "../../../services/admin";
import type {
  Admin,
  AdminStats,
  ApiResponse,
  CreateAdminData,
  AdminsResponse,
  AdminStatsResponse,
  AdminResponse,
} from "../../../types";

// State interface
interface AdminState {
  admins: Admin[];
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  currentAdmin: Admin | null;
}

// Initial state
const initialState: AdminState = {
  admins: [],
  stats: null,
  loading: false,
  error: null,
  success: false,
  currentAdmin: null,
};

// Async thunks with proper typing
export const fetchAdmins = createAsyncThunk<
  AdminsResponse, // Return type
  void, // Args type
  { rejectValue: string } // Reject value type
>("admins/fetchAdmins", async (_, { rejectWithValue }) => {
  try {
    const response = await adminApi.getAllAdmins();
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch admins"
    );
  }
});

export const fetchAdminStats = createAsyncThunk<
  AdminStatsResponse,
  void,
  { rejectValue: string }
>("admins/fetchAdminStats", async (_, { rejectWithValue }) => {
  try {
    const response = await adminApi.getAdminStats();
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch admin stats"
    );
  }
});

export const searchAdmins = createAsyncThunk<
  AdminsResponse,
  string, // query parameter
  { rejectValue: string }
>("admins/searchAdmins", async (query, { rejectWithValue }) => {
  try {
    const response = await adminApi.searchAdmins(query);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Search failed");
  }
});

export const createAdmin = createAsyncThunk<
  AdminResponse,
  CreateAdminData,
  { rejectValue: string }
>("admins/createAdmin", async (adminData, { rejectWithValue }) => {
  try {
    const response = await adminApi.createAdmin(adminData);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create admin"
    );
  }
});

export const deleteAdmin = createAsyncThunk<
  string, // return adminId on success
  string, // adminId parameter
  { rejectValue: string }
>("admins/deleteAdmin", async (adminId, { rejectWithValue }) => {
  try {
    await adminApi.deleteAdmin(adminId);
    return adminId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete admin"
    );
  }
});

const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.currentAdmin = action.payload;
    },
    resetAdminState: (state) => {
      state.admins = [];
      state.stats = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentAdmin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchAdmins.fulfilled,
        (state, action: PayloadAction<AdminsResponse>) => {
          state.loading = false;
          state.admins = action.payload.data;
          state.success = true;
          state.error = null;
        }
      )
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Fetch Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchAdminStats.fulfilled,
        (state, action: PayloadAction<AdminStatsResponse>) => {
          state.stats = action.payload.data;
          state.error = null;
        }
      )
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Search Admins
      .addCase(searchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchAdmins.fulfilled,
        (state, action: PayloadAction<AdminsResponse>) => {
          state.loading = false;
          state.admins = action.payload.data;
          state.error = null;
        }
      )
      .addCase(searchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createAdmin.fulfilled,
        (state, action: PayloadAction<AdminResponse>) => {
          state.loading = false;
          state.admins.push(action.payload.data);
          state.success = true;
          state.error = null;
        }
      )
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.error = null;
        state.success = false;
      })
      .addCase(
        deleteAdmin.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.admins = state.admins.filter(
            (admin: any) => admin._id !== action.payload
          );
          state.success = true;
          state.error = null;
        }
      )
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, setCurrentAdmin, resetAdminState } =
  adminSlice.actions;

export default adminSlice.reducer;
