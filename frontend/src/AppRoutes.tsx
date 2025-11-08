import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";

import Dashboard from "./pages/Dashboard/Dashboard";

import AddPatient from "./pages/Dashboard/AddPatient/AddPatient";

import AddStaff from "./pages/Register/Register";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home/Home";

import Doctors from "./pages/Dashboard/Doctors/Doctors";

import ViewPatients from "./pages/Dashboard/patients/view-patients/ViewPatients";

import Admins from "./pages/Dashboard/Admins/Admins";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/staff/add"
          element={
            <ProtectedRoute>
              <AddStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <ProtectedRoute>
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <ViewPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <Admins />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
