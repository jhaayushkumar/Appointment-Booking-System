import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { registerPatient, registerDoctor } from "../api/auth.api";
import { toast } from "react-hot-toast";

const patientInitial = {
  name: "",
  email: "",
  phone: "",
  password: "",
  age: "",
  gender: "",
  address: "",
};

const doctorInitial = {
  name: "",
  email: "",
  phone: "",
  password: "",
  specialization: "",
};

export const RegisterForm = ({ userType, onSuccess }) => {
  const [formData, setFormData] = useState(
    userType === "patient" ? patientInitial : doctorInitial
  );
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loadingRef = useRef(false);
  const toastIdRef = useRef(null);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setFormData(userType === "patient" ? patientInitial : doctorInitial);
    setError("");
  }, [userType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    loadingRef.current = true;

    toastIdRef.current = toast.loading("Creating account...");

    try {
      const response =
        userType === "patient"
          ? await registerPatient(formData)
          : await registerDoctor(formData);

      onSuccess({
        success: true,
        role: userType,
        name: response.user.name,
      });
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      onSuccess({ success: false, error: message });
    } finally {
      loadingRef.current = false;
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Typography color="error" sx={{ mb: 2, fontWeight: 500 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Full Name - full width */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={loadingRef.current}
            variant="outlined"
            size="medium"
            sx={{ borderRadius: 1 }}
          />
        </Grid>

        {/* Email - full width */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loadingRef.current}
            variant="outlined"
            size="medium"
            sx={{ borderRadius: 1 }}
          />
        </Grid>

        {/* Phone & Password side by side */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={loadingRef.current}
            variant="outlined"
            size="medium"
            sx={{ borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loadingRef.current}
            variant="outlined"
            size="medium"
            sx={{ borderRadius: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* PATIENT FIELDS */}
        {userType === "patient" && (
          <>
            {/* Age & Gender side by side */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="age"
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                disabled={loadingRef.current}
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ borderRadius: 1 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loadingRef.current}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Address full width */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                disabled={loadingRef.current}
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          </>
        )}

        {/* DOCTOR FIELDS */}
        {userType === "doctor" && (
          <>
            {/* Specialization & Experience side by side */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="specialization"
                label="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={loadingRef.current}
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Button
        fullWidth
        sx={{
          mt: 3,
          mb: 2,
          py: 1.5,
          fontWeight: 600,
          borderRadius: 2,
        }}
        variant="contained"
        type="submit"
        disabled={loadingRef.current}
      >
        {loadingRef.current ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </Box>
  );
};
