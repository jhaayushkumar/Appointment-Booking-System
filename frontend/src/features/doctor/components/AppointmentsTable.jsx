import React from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Box,
  Typography,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

const statusColors = {
  PENDING: "warning",
  BOOKED: "success",
  CANCELLED: "error",
  COMPLETED: "info",
};

const AppointmentsTable = ({ appointments, onStatusUpdate }) => {
  const handleStatusChange = async (appointmentId, status) => {
    await onStatusUpdate(appointmentId, status);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Date &amp; Time</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => {
            const patientName =
              appointment?.patientName || "Unknown";
            const patientPhone =
              appointment?.patientPhone  || "N/A";
            const appointmentDate =
              appointment?.date  || null;
            const reason = appointment?.reason || "General Consultation";
            const normalizedStatus = (
              appointment?.status || "PENDING"
            ).toUpperCase();
            const statusLabel =
              normalizedStatus.charAt(0) +
              normalizedStatus.slice(1).toLowerCase();

            return (
              <TableRow key={appointment.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EventIcon color="action" />
                    <Box>
                      <Typography variant="body1">{patientName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patientPhone}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {appointmentDate ? (
                    <Typography>
                      {format(new Date(appointmentDate), "PPp")}
                    </Typography>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{reason}</TableCell>
                <TableCell>
                  <Chip
                    label={statusLabel}
                    color={statusColors[normalizedStatus] || "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    {normalizedStatus === "PENDING" && (
                      <>
                        <Tooltip title="Confirm">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() =>
                              handleStatusChange(appointment.id, "BOOKED")
                            }
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleStatusChange(appointment.id, "CANCELLED")
                            }
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {normalizedStatus === "BOOKED" && (
                      <Tooltip title="Mark as completed">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CheckIcon fontSize="small" />}
                          onClick={() =>
                            handleStatusChange(appointment.id, "COMPLETED")
                          }
                        >
                          Complete
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

AppointmentsTable.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      patientName: PropTypes.string,
      patientPhone: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      reason: PropTypes.string,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default AppointmentsTable;
