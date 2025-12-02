import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  getPatientAppointments,
  cancelPatientAppointment,
} from "../api/patient.api";

const statusColors = {
  PENDING: "warning",
  BOOKED: "success",
  COMPLETED: "info",
  CANCELLED: "error",
};

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPatientAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const openCancelDialog = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const closeCancelDialog = () => {
    if (cancellingId) {
      return;
    }
    setCancelModalOpen(false);
    setCancelReason("");
    setSelectedAppointmentId(null);
  };

  const handleCancel = async () => {
    if (!selectedAppointmentId) {
      return;
    }
    const reason = cancelReason.trim() || "No reason provided";
    setCancellingId(selectedAppointmentId);
    try {
      await cancelPatientAppointment(selectedAppointmentId, reason);
      toast.success("Appointment cancelled");
      fetchAppointments();
      closeCancelDialog();
    } catch (error) {
      console.error("Failed to cancel appointment", error);
      toast.error("Unable to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const formattedAppointments = useMemo(
    () =>
      appointments.map((appointment) => {
        const normalizedStatus = (
          appointment.status || "PENDING"
        ).toUpperCase();
        const doctor = appointment.doctor || {};
        const slot = appointment.slot || {};

        return {
          id: appointment.id,
          status: normalizedStatus,
          doctorName: doctor.name || "Unknown Doctor",
          specialization: doctor.specialization || "General",
          email: doctor.email || "N/A",
          phone: doctor.phone || "N/A",
          date: appointment.date || slot.startTime,
          slotEnd: slot.endTime,
        };
      }),
    [appointments]
  );

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Appointments</Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : formattedAppointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {formattedAppointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment.id}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="h6">
                      Dr. {appointment.doctorName}
                    </Typography>
                    <Chip
                      label={appointment.status}
                      color={statusColors[appointment.status] || "default"}
                      size="small"
                    />
                  </Stack>
                  <Typography color="text.secondary" gutterBottom>
                    {appointment.specialization}
                  </Typography>
                  <Typography variant="body2">
                    Email: {appointment.email}
                  </Typography>
                  <Typography variant="body2">
                    Phone: {appointment.phone}
                  </Typography>
                  {appointment.date && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {format(new Date(appointment.date), "PPpp")}
                      {appointment.slotEnd
                        ? ` - ${format(new Date(appointment.slotEnd), "pp")}`
                        : ""}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} mt={2}>
                    {appointment.status === "PENDING" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => openCancelDialog(appointment.id)}
                        disabled={cancellingId === appointment.id}
                      >
                        {cancellingId === appointment.id
                          ? "Cancelling..."
                          : "Cancel"}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog
        open={cancelModalOpen}
        onClose={closeCancelDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cancel appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please let us know why you're cancelling. This helps keep your
            doctor informed.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Reason (optional)"
            multiline
            minRows={3}
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            disabled={Boolean(cancellingId)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} disabled={Boolean(cancellingId)} variant="contained">
            Keep appointment
          </Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={Boolean(cancellingId)}
          >
            {cancellingId ? "Cancelling..." : "Confirm cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientAppointments;
