import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Doctors from "./Pages/Doctors";
import Patients from "./Pages/Patients";
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Profile from "./Pages/Profile";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Box sx={{ pt: isLoginPage ? 0 : 8, minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route 
              path="/patient/dashboard" 
              element={
                  <Patients />
              } 
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route 
              path="/doctor/dashboard" 
              element={
                  <Doctors />
              } 
            />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route 
              path="/doctor/profile" 
              element={
                  <Profile/>
              } 
            />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route 
              path="/patient/profile" 
              element={
                  <Profile/>
              } 
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
