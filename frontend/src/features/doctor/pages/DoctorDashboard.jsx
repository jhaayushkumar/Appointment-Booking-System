import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, Tabs, Tab } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";
import { getDoctorAppointments } from "../api/doctor.api";
import AppointmentList from "../components/AppointmentList";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments(user.id);
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAppointmentAction = (appointmentId, status) => {
    const normalizedStatus = (status || "PENDING").toUpperCase();
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: normalizedStatus }
          : appointment
      )
    );
  };

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  const bookedAppointments = appointments.filter(
    (appointment) => (appointment.status || "").toUpperCase() === "BOOKED"
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, Dr. {user?.name}
        </Typography>
        <Typography>
          Upcoming appointments:{" "}
          {appointments.filter((a) => a.status === "BOOKED").length}
        </Typography>
      </Paper>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Appointments" />
        <Tab label="Availability" />
      </Tabs>

      {tabValue === 0 && (
        <AppointmentList
          appointments={bookedAppointments}
          onAction={handleAppointmentAction}
        />
      )}

      {tabValue === 1 && <AvailabilityCalendar doctorId={user?.id} />}
    </Box>
  );
};

export default DoctorDashboard;
