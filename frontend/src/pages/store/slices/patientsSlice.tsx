// src/store/slices/patientsSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { patientsAPI } from "../../../services/patient";

import type {
  PatientResponse,
  SimilarPatient,
  GlobalStats,
} from "../../../types";

interface PatientsState {
  patients: PatientResponse[];
  currentPatient: PatientResponse | null;
  similarPatients: SimilarPatient[];
  stats: GlobalStats[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientsState = {
  patients: [],
  currentPatient: null,
  similarPatients: [],
  stats: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async () => {
    const response = await patientsAPI.getAll();
    return response;
  }
);

export const fetchPatientById = createAsyncThunk(
  "patients/fetchPatientById",
  async (patientId: string) => {
    const response = await patientsAPI.getById(patientId);
    return response;
  }
);

export const deletePatient = createAsyncThunk(
  "patients/deletePatient",
  async (patientId: string) => {
    await patientsAPI.delete(patientId);
    return patientId;
  }
);

export const fetchSimilarPatients = createAsyncThunk(
  "patients/fetchSimilarPatients",
  async (patientId: string) => {
    const response = await patientsAPI.findSimilar(patientId);
    return response;
  }
);

export const fetchPatientStats = createAsyncThunk(
  "patients/fetchPatientStats",
  async () => {
    const response = await patientsAPI.getStats();
    return response;
  }
);

const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPatients.fulfilled,
        (state, action: PayloadAction<PatientResponse[]>) => {
          state.loading = false;
          state.patients = action.payload;
        }
      )
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch patients";
      })
      // Fetch patient by ID
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPatientById.fulfilled,
        (state, action: PayloadAction<PatientResponse>) => {
          state.loading = false;
          state.currentPatient = action.payload;
        }
      )
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch patient";
      })
      // Delete patient
      .addCase(
        deletePatient.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.patients = state.patients.filter(
            (patient) => patient._id !== action.payload
          );
        }
      )
      // Fetch similar patients
      .addCase(
        fetchSimilarPatients.fulfilled,
        (state, action: PayloadAction<SimilarPatient[]>) => {
          state.similarPatients = action.payload;
        }
      )
      // Fetch stats
      .addCase(
        fetchPatientStats.fulfilled,
        (state, action: PayloadAction<GlobalStats[]>) => {
          state.stats = action.payload;
        }
      );
  },
});

export const { clearCurrentPatient, clearError } = patientsSlice.actions;
export default patientsSlice.reducer;
