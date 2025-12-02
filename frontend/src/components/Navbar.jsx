import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/axiosClient";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  People as PatientsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      const endpoint = user.role === "doctor" ? "/auth/doctor/logout" : "/auth/patient/logout";
      await api.post(endpoint);
      
      // Clear local auth state
      logout();
      
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if backend call fails, clear local state
      logout();
      navigate("/login");
    }
  };

  const goToProfile = () => {
    navigate(`/${user.role}/profile`);
  };

  // Reusable active style for nav links
  const navButtonStyle = (path) => ({
    color: "white",
    borderBottom:
      location.pathname === path ? "3px solid white" : "3px solid transparent",
    borderRadius: 0,
    textTransform: "none",
    "&:hover": {
      borderBottom: "3px solid white",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
  });

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* App Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          style={{
            flexGrow: 1,
            color: "white",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Clinic App
        </Typography>

        {/* USER LOGGED IN */}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* DOCTOR NAVIGATION */}
            {user.role === "doctor" && (
              <>
                <Button
                  component={RouterLink}
                  to="/doctor/dashboard"
                  sx={navButtonStyle("/doctor/dashboard")}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>

                <Button
                  component={RouterLink}
                  to="/doctor/appointments"
                  sx={navButtonStyle("/doctor/appointments")}
                  startIcon={<CalendarIcon />}
                >
                  Appointments
                </Button>

                <Button
                  component={RouterLink}
                  to="/doctor/slots"
                  sx={navButtonStyle("/doctor/slots")}
                  startIcon={<ScheduleIcon />}
                >
                  Slots
                </Button>

                <Button
                  component={RouterLink}
                  to="/doctor/patients"
                  sx={navButtonStyle("/doctor/patients")}
                  startIcon={<PatientsIcon />}
                >
                  Patients
                </Button>
              </>
            )}

            {/* PATIENT NAVIGATION */}
            {user.role === "patient" && (
              <>
                <Button
                  component={RouterLink}
                  to="/patient/dashboard"
                  sx={navButtonStyle("/patient/dashboard")}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>

                <Button
                  component={RouterLink}
                  to="/patient/doctors"
                  sx={navButtonStyle("/patient/doctors")}
                  startIcon={<PatientsIcon />}
                >
                  Find Doctors
                </Button>

                <Button
                  component={RouterLink}
                  to="/patient/appointments"
                  sx={navButtonStyle("/patient/appointments")}
                  startIcon={<CalendarIcon />}
                >
                  My Appointments
                </Button>

                <Button
                  component={RouterLink}
                  to="/patient/profile"
                  sx={navButtonStyle("/patient/profile")}
                  startIcon={<PersonIcon />}
                >
                  Profile
                </Button>
              </>
            )}

            {/* PROFILE BUTTON (doctors only, patients already have one above) */}
            {user.role === "doctor" && (
              <Button
                onClick={goToProfile}
                sx={navButtonStyle(`/${user.role}/profile`)}
                startIcon={<PersonIcon />}
              >
                Profile
              </Button>
            )}

            {/* 🔥 UNIQUE, PROFESSIONAL-LOOKING RED LOGOUT BUTTON */}
            <Button
              onClick={handleLogout}
              sx={{
                ml: 1,
                color: "white",
                textTransform: "none",
                border: "1px solid white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
