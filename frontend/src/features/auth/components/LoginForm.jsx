import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../api/auth.api";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";

export const LoginForm = ({ userType, onSuccess }) => {
  const { loginRequest } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const errorRef = useRef("");

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loadingRef = useRef(false); // loading state
  const toastIdRef = useRef(null); // toast id

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    errorRef.current = "";
    loadingRef.current = true;

    toastIdRef.current = toast.loading("Signing in...");

    try {
      const data = await login(userType, credentials);

      if (!data?.user) {
        errorRef.current = "Invalid response from server";
        toast.error("Invalid response from server");
        onSuccess({ success: false, error: "Invalid response from server" });
        return;
      }

      // Add role to user object if not present
      const userWithRole = { ...data.user, role: userType };
      loginRequest(userWithRole);

      onSuccess({ success: true, role: userType, name: data.user.name });
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials";
      toast.error(message);
      // onSuccess({ success: false, error: message });
    } finally {
      loadingRef.current = false;
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {errorRef.current && (
        <Box mb={2} sx={{ color: "red" }}>
          {errorRef.current}
        </Box>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        type={showPassword ? "text" : "password"}
        label="Password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        required
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
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        type="submit"
        disabled={loadingRef.current}
      >
        {loadingRef.current ? <CircularProgress size={24} /> : "Sign In"}
      </Button>
    </Box>
  );
};
