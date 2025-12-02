import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "./hooks/useAuth";

// Features
import Login from "./features/auth/pages/Login";
import DoctorDashboard from "./features/doctor/pages/DoctorDashboard";
import PatientDashboard from "./features/patient/pages/PatientDashboard";
import PatientDoctors from "./features/patient/pages/PatientDoctors";
import PatientAppointments from "./features/patient/pages/PatientAppointments";
import Profile from "./features/profile/pages/Profile";

// Doctor Pages
import DoctorAppointments from "./features/doctor/pages/DoctorAppointments";
import DoctorSlots from "./features/doctor/pages/DoctorSlots";
import DoctorPatients from "./features/doctor/pages/DoctorPatients";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    user?.role === "doctor"
                      ? "/doctor/dashboard"
                      : "/patient/dashboard"
                  }
                  replace
                />
              ) : (
                <Login />
              )
            }
          />

          {/* Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/doctors" element={<PatientDoctors />} />
            <Route
              path="/patient/appointments"
              element={<PatientAppointments />}
            />
            <Route path="/patient/profile" element={<Profile />} />
            <Route
              path="/patient"
              element={<Navigate to="/patient/dashboard" replace />}
            />
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointments />}
            />
            <Route path="/doctor/slots" element={<DoctorSlots />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/profile" element={<Profile />} />
            <Route
              path="/doctor"
              element={<Navigate to="/doctor/dashboard" replace />}
            />
          </Route>

          {/* Default redirect */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    user?.role === "doctor"
                      ? "/doctor/dashboard"
                      : "/patient/dashboard"
                  }
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
