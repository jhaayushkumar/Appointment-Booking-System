import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Paper,
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CssBaseline,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

const Login = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);             
  const [userType, setUserType] = useState("patient");

  const handleTabChange = (_, val) => setTab(val);
  const handleUserTypeChange = (e) => setUserType(e.target.value);

  // ---------- LOGIN Handling ----------
  const handleLoginSuccess = ({ success, role, name }) => {
    if (!success) return;

    toast.success(`Welcome back, ${name}!`);
    navigate(`/${role}/dashboard`);
  };

  // ---------- REGISTER Handling ----------
  const handleRegisterSuccess = ({ success, role, error, name }) => {
    if (!success) {
      toast.error(error);
      return;
    }

    toast.success(`Account created successfully! Welcome ${name}.`);
    navigate(`/${role}/dashboard`);
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Appointment Booking System
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          {/* Patient / Doctor dropdown */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>I am a</InputLabel>
            <Select
              value={userType}
              label="I am a"
              onChange={handleUserTypeChange}
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
            </Select>
          </FormControl>

          {/* Forms */}
          {tab === 0 ? (
            <LoginForm
              userType={userType}
              onSuccess={handleLoginSuccess}
            />
          ) : (
            <RegisterForm
              userType={userType}
              onSuccess={handleRegisterSuccess}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
