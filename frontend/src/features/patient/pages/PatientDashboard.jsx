import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  CircularProgress,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";
import {
  CalendarMonth,
  LocalHospital,
  Schedule,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPatientAppointments, getPatientDoctors } from "../api/patient.api";
import { format } from "date-fns";
import toast from "react-hot-toast";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    availableDoctors: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appointments, doctors] = await Promise.all([
        getPatientAppointments(),
        getPatientDoctors(),
      ]);

      const now = new Date();
      const upcoming = appointments.filter(
        (apt) =>
          apt.status === "PENDING" || apt.status === "BOOKED"
      );
      const completed = appointments.filter(
        (apt) => apt.status === "COMPLETED"
      );

      setStats({
        totalAppointments: appointments.length,
        upcomingAppointments: upcoming.length,
        completedAppointments: completed.length,
        availableDoctors: doctors.length,
      });

      setUpcomingAppointments(upcoming.slice(0, 3));
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      action: () => navigate("/patient/appointments"),
    },
    {
      title: "Upcoming",
      value: stats.upcomingAppointments,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
      action: () => navigate("/patient/appointments"),
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
      action: () => navigate("/patient/appointments"),
    },
    {
      title: "Available Doctors",
      value: stats.availableDoctors,
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      color: "#9c27b0",
      action: () => navigate("/patient/doctors"),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Welcome to Your Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Manage your appointments and find doctors
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

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LocalHospital />}
            onClick={() => navigate("/patient/doctors")}
            sx={{ flex: 1 }}
          >
            Find & Book Doctor
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<CalendarMonth />}
            onClick={() => navigate("/patient/appointments")}
            sx={{ flex: 1 }}
          >
            View All Appointments
          </Button>
        </Stack>
      </Paper>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontWeight={600}>
              Upcoming Appointments
            </Typography>
            <Button
              size="small"
              onClick={() => navigate("/patient/appointments")}
            >
              View All
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {upcomingAppointments.map((appointment) => (
              <Grid item xs={12} md={4} key={appointment.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" fontSize={18}>
                        Dr. {appointment.doctor?.name || "Unknown"}
                      </Typography>
                      <Chip
                        label={appointment.status}
                        color={appointment.status === "BOOKED" ? "success" : "warning"}
                        size="small"
                      />
                    </Stack>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {appointment.doctor?.specialization || "General"}
                    </Typography>
                    {appointment.date && (
                      <Typography variant="body2" color="primary" mt="auto">
                        {format(new Date(appointment.date), "PPp")}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {upcomingAppointments.length === 0 && (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "background.default",
          }}
        >
          <LocalHospital sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Upcoming Appointments
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Book an appointment with a doctor to get started
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/patient/doctors")}
          >
            Find a Doctor
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PatientDashboard;
