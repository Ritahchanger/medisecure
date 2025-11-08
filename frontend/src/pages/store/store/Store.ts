// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

import patientsReducer from "../slices/patientsSlice";

import adminSlice from "../slices/adminSlice";

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    admins: adminSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
