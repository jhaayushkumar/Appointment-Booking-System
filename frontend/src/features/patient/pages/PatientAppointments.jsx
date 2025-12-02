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
  Paper,
  Avatar,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add,
  CalendarMonth,
  LocalHospital,
  Phone,
  Email,
  Cancel,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [filterTab, setFilterTab] = useState("all");
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      
      // Update local state immediately
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointmentId
            ? { ...apt, status: "CANCELLED" }
            : apt
        )
      );
      
      toast.success("Appointment cancelled successfully");
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

  const filteredAppointments = useMemo(() => {
    if (filterTab === "all") return formattedAppointments;
    if (filterTab === "upcoming") {
      return formattedAppointments.filter(
        (apt) => apt.status === "PENDING" || apt.status === "BOOKED"
      );
    }
    if (filterTab === "completed") {
      return formattedAppointments.filter((apt) => apt.status === "COMPLETED");
    }
    if (filterTab === "cancelled") {
      return formattedAppointments.filter((apt) => apt.status === "CANCELLED");
    }
    return formattedAppointments;
  }, [formattedAppointments, filterTab]);

  const openViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setViewDetailsModal(true);
  };

  const closeViewDetails = () => {
    setViewDetailsModal(false);
    setSelectedAppointment(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Schedule color="warning" />;
      case "BOOKED":
        return <CheckCircle color="success" />;
      case "COMPLETED":
        return <CheckCircle color="info" />;
      case "CANCELLED":
        return <Cancel color="error" />;
      default:
        return <Schedule />;
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            My Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your appointments
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate("/patient/doctors")}
        >
          Book New Appointment
        </Button>
      </Stack>

      {/* Filter Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={filterTab}
          onChange={(e, newValue) => setFilterTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" value="all" />
          <Tab label="Upcoming" value="upcoming" />
          <Tab label="Completed" value="completed" />
          <Tab label="Cancelled" value="cancelled" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "background.default",
          }}
        >
          <LocalHospital sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={600}>
            No Appointments Found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {filterTab === "all"
              ? "You haven't booked any appointments yet"
              : `No ${filterTab} appointments`}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate("/patient/doctors")}
          >
            Book Your First Appointment
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredAppointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header with Status */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {getStatusIcon(appointment.status)}
                      <Chip
                        label={appointment.status}
                        color={statusColors[appointment.status] || "default"}
                        size="small"
                      />
                    </Stack>
                  </Stack>

                  {/* Doctor Info */}
                  <Stack direction="row" spacing={2} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 50,
                        height: 50,
                      }}
                    >
                      {appointment.doctorName?.charAt(0) || "D"}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Dr. {appointment.doctorName}
                      </Typography>
                      <Chip
                        label={appointment.specialization}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Contact Info */}
                  <Stack spacing={1} mb={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {appointment.email}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {appointment.phone}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Date & Time */}
                  {appointment.date && (
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarMonth fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(appointment.date), "PPPP")}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" ml={4}>
                        {format(new Date(appointment.date), "p")}
                        {appointment.slotEnd
                          ? ` - ${format(new Date(appointment.slotEnd), "p")}`
                          : ""}
                      </Typography>
                    </Stack>
                  )}

                  {/* Actions */}
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => openViewDetails(appointment)}
                    >
                      View Details
                    </Button>
                    {(appointment.status === "PENDING" ||
                      appointment.status === "BOOKED") && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => openCancelDialog(appointment.id)}
                        disabled={cancellingId === appointment.id}
                      >
                        {cancellingId === appointment.id ? "Cancelling..." : "Cancel"}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Cancel Dialog */}
      <Dialog
        open={cancelModalOpen}
        onClose={closeCancelDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Cancel Appointment
          </Typography>
        </DialogTitle>
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
            placeholder="e.g., Schedule conflict, feeling better, etc."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={closeCancelDialog} disabled={Boolean(cancellingId)} size="large">
            Keep Appointment
          </Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={Boolean(cancellingId)}
            size="large"
          >
            {cancellingId ? "Cancelling..." : "Confirm Cancel"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDetailsModal}
        onClose={closeViewDetails}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Appointment Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ pt: 1 }}>
              {/* Doctor Info */}
              <Paper elevation={0} sx={{ bgcolor: "primary.light", p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", width: 60, height: 60 }}>
                    {selectedAppointment.doctorName?.charAt(0) || "D"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Dr. {selectedAppointment.doctorName}
                    </Typography>
                    <Chip
                      label={selectedAppointment.specialization}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Stack>
              </Paper>

              {/* Status */}
              <Paper elevation={0} sx={{ bgcolor: "background.default", p: 2, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  STATUS
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  {getStatusIcon(selectedAppointment.status)}
                  <Chip
                    label={selectedAppointment.status}
                    color={statusColors[selectedAppointment.status] || "default"}
                  />
                </Stack>
              </Paper>

              {/* Details */}
              <Paper elevation={0} sx={{ bgcolor: "background.default", p: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  APPOINTMENT INFORMATION
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={2} mt={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonth color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedAppointment.date &&
                          format(new Date(selectedAppointment.date), "PPPP, p")}
                        {selectedAppointment.slotEnd &&
                          ` - ${format(new Date(selectedAppointment.slotEnd), "p")}`}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Email color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedAppointment.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedAppointment.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeViewDetails} variant="contained" size="large">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientAppointments;
