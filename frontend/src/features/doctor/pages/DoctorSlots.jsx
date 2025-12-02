import React from "react";
import { Box, Typography } from "@mui/material";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

const DoctorSlots = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Availability
      </Typography>
      <AvailabilityCalendar doctorId="current" />
    </Box>
  );
};

export default DoctorSlots;
