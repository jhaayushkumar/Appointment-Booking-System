import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { api } from "../main.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [signin, setSignin] = useState({ email: "", password: "" });

  // Patient signup state
  const [patientSignup, setPatientSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    gender: "male",
  });

  // Doctor signup state
  const [doctorSignup, setDoctorSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    experience: "",
    qualification: "",
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    setSuccess("");
    setTab(0);
    setSignin({ email: "", password: "" });
    setPatientSignup({
      name: "",
      email: "",
      phone: "",
      password: "",
      age: "",
      gender: "male",
    });
    setDoctorSignup({
      name: "",
      email: "",
      phone: "",
      password: "",
      specialization: "",
      experience: "",
      qualification: "",
    });
  };

  const onSignin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!signin.email || !signin.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        role === "patient"
          ? "/api/auth/patient/login"
          : "/api/auth/doctor/login";
      const response = await api.post(endpoint, signin);

      if (response.data?.user) {
        localStorage.setItem("role", role);
        localStorage.setItem("userName", response.data.user.name);
        
        const redirectPath = role === "patient" ? "/patient/dashboard" : "/doctor/dashboard";
        navigate(redirectPath);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    const currentSignup = role === "patient" ? patientSignup : doctorSignup;
    if (
      !currentSignup.name ||
      !currentSignup.email ||
      !currentSignup.phone ||
      !currentSignup.password
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (role === "patient" && (!currentSignup.age || currentSignup.age < 0)) {
      setError("Please enter a valid age");
      return;
    }

    if (
      role === "doctor" &&
      (!currentSignup.specialization ||
        !currentSignup.experience ||
        !currentSignup.qualification)
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        role === "patient"
          ? "/api/auth/patient/signup"
          : "/api/auth/doctor/signup";
      const payload =
        role === "patient"
          ? { ...currentSignup, age: Number(currentSignup.age) }
          : { ...currentSignup, experience: Number(currentSignup.experience) };

      const response = await api.post(endpoint, payload);

      if (response.data?.user) {
        localStorage.setItem("role", role);
        localStorage.setItem("userName", response.data.user.name);
      }

      setSuccess("Registration successful! Redirecting to dashboard...");

      setTimeout(() => {
        const redirectPath =
          role === "patient" ? "/patient/dashboard" : "/doctor/dashboard";
        navigate(redirectPath);
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      api.get(`/api/${role}s/profile`)
        .then(() => {
          navigate(`/${role}/dashboard`);
        })
        .catch(() => {
          localStorage.removeItem("role");
          localStorage.removeItem("userName");
        });
    }
  }, [navigate]);

  return (
    <Container 
      maxWidth="sm" 
      sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Paper elevation={3} sx={{ width: "100%", p: 4, my: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            {role === "patient" ? "Patient Portal" : "Doctor Portal"}
          </Typography>

          {/* Role Selector */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Select Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={role}
                label="Select Role"
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {(error || success) && (
            <Stack mb={2} spacing={1}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Stack>
          )}

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {tab === 0 && (
            <Box component="form" onSubmit={onSignin}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  value={signin.email}
                  onChange={(e) =>
                    setSignin({ ...signin, email: e.target.value })
                  }
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={signin.password}
                  onChange={(e) =>
                    setSignin({ ...signin, password: e.target.value })
                  }
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : `Sign In as ${role === "patient" ? "Patient" : "Doctor"}`}
                </Button>
              </Stack>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={onSignup}>
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  value={
                    role === "patient" ? patientSignup.name : doctorSignup.name
                  }
                  onChange={(e) => {
                    if (role === "patient") {
                      setPatientSignup({
                        ...patientSignup,
                        name: e.target.value,
                      });
                    } else {
                      setDoctorSignup({
                        ...doctorSignup,
                        name: e.target.value,
                      });
                    }
                  }}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={
                    role === "patient"
                      ? patientSignup.email
                      : doctorSignup.email
                  }
                  onChange={(e) => {
                    if (role === "patient") {
                      setPatientSignup({
                        ...patientSignup,
                        email: e.target.value,
                      });
                    } else {
                      setDoctorSignup({
                        ...doctorSignup,
                        email: e.target.value,
                      });
                    }
                  }}
                  required
                  fullWidth
                />
                <TextField
                  label={role === "patient" ? "Phone Number" : "Contact Number"}
                  value={
                    role === "patient"
                      ? patientSignup.phone
                      : doctorSignup.phone
                  }
                  onChange={(e) => {
                    if (role === "patient") {
                      setPatientSignup({
                        ...patientSignup,
                        phone: e.target.value,
                      });
                    } else {
                      setDoctorSignup({
                        ...doctorSignup,
                        phone: e.target.value,
                      });
                    }
                  }}
                  required
                  fullWidth
                />

                {role === "patient" ? (
                  // Patient specific fields
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Age"
                          type="number"
                          value={patientSignup.age}
                          onChange={(e) =>
                            setPatientSignup({
                              ...patientSignup,
                              age: e.target.value,
                            })
                          }
                          required
                          fullWidth
                          slotProps={{
                            input: {
                              min: 0,
                              max: 10,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          select
                          label="Gender"
                          value={patientSignup.gender}
                          onChange={(e) =>
                            setPatientSignup({
                              ...patientSignup,
                              gender: e.target.value,
                            })
                          }
                          required
                          fullWidth
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  // Doctor specific fields
                  <>
                    <TextField
                      label="Specialization"
                      value={doctorSignup.specialization}
                      onChange={(e) =>
                        setDoctorSignup({
                          ...doctorSignup,
                          specialization: e.target.value,
                        })
                      }
                      required
                      fullWidth
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Experience (Years)"
                          type="number"
                          value={doctorSignup.experience}
                          onChange={(e) =>
                            setDoctorSignup({
                              ...doctorSignup,
                              experience: e.target.value,
                            })
                          }
                          required
                          fullWidth
                          slotProps={{
                            input: {
                              min: 0,
                              max: 10,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Qualification"
                          value={doctorSignup.qualification}
                          onChange={(e) =>
                            setDoctorSignup({
                              ...doctorSignup,
                              qualification: e.target.value,
                            })
                          }
                          required
                          fullWidth
                          placeholder="e.g., MD, MBBS"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                <TextField
                  label="Password"
                  type="password"
                  value={
                    role === "patient"
                      ? patientSignup.password
                      : doctorSignup.password
                  }
                  onChange={(e) => {
                    if (role === "patient") {
                      setPatientSignup({
                        ...patientSignup,
                        password: e.target.value,
                      });
                    } else {
                      setDoctorSignup({
                        ...doctorSignup,
                        password: e.target.value,
                      });
                    }
                  }}
                  required
                  fullWidth
                  helperText={
                    role === "patient"
                      ? "Password must be at least 6 characters"
                      : "Password must be at least 8 characters with numbers and special characters"
                  }
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading
                    ? "Creating account..."
                    : `Register as ${
                        role === "patient" ? "Patient" : "Doctor"
                      }`}
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
