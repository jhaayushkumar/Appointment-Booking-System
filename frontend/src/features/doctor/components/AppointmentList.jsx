import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Typography,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import { updateAppointmentStatus } from "../api/doctor.api";
import { normalizeAppointments } from "../utils/appointments";
import toast from "react-hot-toast";

const AppointmentList = ({ appointments, onAction }) => {
  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const normalizedStatus = (status || "PENDING").toUpperCase();
      await updateAppointmentStatus(appointmentId, normalizedStatus);
      onAction(appointmentId, normalizedStatus);
      toast.success(`Appointment ${normalizedStatus.toLowerCase()}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const getStatusColor = (status) => {
    const normalized = (status || "PENDING").toUpperCase();

    switch (normalized) {
      case "BOOKED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  const normalizedAppointments = normalizeAppointments(appointments);

  if (normalizedAppointments.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No appointments found.</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {normalizedAppointments.map((appointment, index) => (
          <React.Fragment key={appointment.id}>
            <ListItem>
              <ListItemText
                primary={`${appointment.patientName}`}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {appointment.dateTime
                        ? new Date(appointment.dateTime).toLocaleString()
                        : "N/A"}
                    </Typography>
                    <br />
                    {appointment.reason}
                  </>
                }
              />
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={appointment.status}
                  color={getStatusColor(appointment.status)}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
                {appointment.status === "PENDING" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        handleStatusUpdate(appointment.id, "BOOKED")
                      }
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() =>
                        handleStatusUpdate(appointment.id, "CANCELLED")
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Box>
            </ListItem>
            {index < normalizedAppointments.length - 1 && (
              <Divider component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default AppointmentList;
