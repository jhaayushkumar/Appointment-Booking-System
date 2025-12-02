import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

const DoctorSlots = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Manage Availability
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Create and manage your available time slots for appointments
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <AvailabilityCalendar doctorId="current" />
      </Paper>
    </Box>
  );
};

export default DoctorSlots;
