import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";
import {
  CalendarMonth,
  People,
  Schedule,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { getDoctorAppointments } from "../api/doctor.api";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    bookedAppointments: 0,
    completedAppointments: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments();
        
        if (!Array.isArray(data)) {
          console.error("Invalid appointments data:", data);
          setAppointments([]);
          setLoading(false);
          return;
        }

        setAppointments(data);

        const pending = data.filter((a) => a.status === "PENDING").length;
        const booked = data.filter((a) => a.status === "BOOKED").length;
        const completed = data.filter((a) => a.status === "COMPLETED").length;

        setStats({
          totalAppointments: data.length,
          pendingAppointments: pending,
          bookedAppointments: booked,
          completedAppointments: completed,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error.message || "Failed to load dashboard");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      action: () => navigate("/doctor/appointments"),
    },
    {
      title: "Pending Requests",
      value: stats.pendingAppointments,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      action: () => navigate("/doctor/appointments"),
    },
    {
      title: "Confirmed",
      value: stats.bookedAppointments,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      action: () => navigate("/doctor/appointments"),
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#9c27b0",
      action: () => navigate("/doctor/patients"),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" p={3}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="text.secondary">
          No user data available
        </Typography>
      </Box>
    );
  }

  const recentAppointments = appointments
    .filter((apt) => apt.status === "PENDING" || apt.status === "BOOKED")
    .slice(0, 3);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Welcome, Dr. {user?.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Manage your appointments and availability
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={stat.action}
            >
              <CardContent sx={{ height: "100%" }}>
                <Stack direction="row" spacing={2} alignItems="center" height="100%">
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Actions
            </Typography>
            <Stack spacing={2} mt={2} flex={1} justifyContent="center">
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CalendarMonth />}
                onClick={() => navigate("/doctor/appointments")}
              >
                Appointments
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Schedule />}
                onClick={() => navigate("/doctor/slots")}
              >
                Manage Slots
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<People />}
                onClick={() => navigate("/doctor/patients")}
              >
                View Patients
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Today's Overview */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Today's Overview
            </Typography>
            <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
              <Grid container spacing={2}>
                {stats.pendingAppointments > 0 && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "warning.light",
                        borderRadius: 1,
                        borderLeft: 4,
                        borderColor: "warning.main",
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} color="warning.dark">
                        ⚠️ {stats.pendingAppointments} Pending Request
                        {stats.pendingAppointments !== 1 ? "s" : ""}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Waiting for your confirmation
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="primary.dark" fontWeight={600}>
                      Confirmed Appointments
                    </Typography>
                    <Typography variant="h2" color="primary.dark" fontWeight={700}>
                      {stats.bookedAppointments}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "success.light",
                      borderRadius: 1,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="success.dark" fontWeight={600}>
                      Completed
                    </Typography>
                    <Typography variant="h2" color="success.dark" fontWeight={700}>
                      {stats.completedAppointments}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Analytics & Recent Appointments */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Appointment Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stats.pendingAppointments}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 8,
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(stats.pendingAppointments / stats.totalAppointments) * 100 || 0}%`,
                        bgcolor: "warning.main",
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Confirmed
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stats.bookedAppointments}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 8,
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(stats.bookedAppointments / stats.totalAppointments) * 100 || 0}%`,
                        bgcolor: "success.main",
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stats.completedAppointments}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 8,
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(stats.completedAppointments / stats.totalAppointments) * 100 || 0}%`,
                        bgcolor: "info.main",
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Appointments */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Recent Appointments
              </Typography>
              <Button
                size="small"
                onClick={() => navigate("/doctor/appointments")}
              >
                View All
              </Button>
            </Stack>
            {recentAppointments.length > 0 ? (
              <Stack spacing={2}>
                {recentAppointments.map((apt) => (
                  <Box
                    key={apt.id}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                        {apt.patient?.name?.charAt(0) || "P"}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight={600}>
                          {apt.patient?.name || "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.date && new Date(apt.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </Typography>
                      </Box>
                      <Chip
                        label={apt.status}
                        size="small"
                        color={apt.status === "BOOKED" ? "success" : "warning"}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No recent appointments
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDashboard;
