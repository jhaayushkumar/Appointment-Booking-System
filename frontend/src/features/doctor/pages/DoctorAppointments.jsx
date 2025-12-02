import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { addDays, subDays, isSameDay, format, startOfDay } from "date-fns";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../api/doctor.api";
import AppointmentsTable from "../components/AppointmentsTable";
import { normalizeAppointments } from "../utils/appointments";
import toast from "react-hot-toast";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfDay(new Date())
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getDoctorAppointments();
        setAppointments(normalizeAppointments(data || []));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const normalizedStatus = (status || "PENDING").toUpperCase();
      await updateAppointmentStatus(appointmentId, normalizedStatus);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: normalizedStatus }
            : appointment
        )
      );
      toast.success(`Appointment ${normalizedStatus.toLowerCase()}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      if (filter === "all") return true;
      return (appointment.status || "").toUpperCase() === filter;
    })
    .filter((appointment) => {
      const term = searchTerm.toLowerCase();
      return (
        appointment.patientName?.toLowerCase().includes(term) ||
        appointment.reason?.toLowerCase().includes(term)
      );
    });

  const appointmentsOnSelectedDate = filteredAppointments.filter(
    (appointment) => {
      const appointmentDateValue = appointment.date || appointment.dateTime;
      if (!appointmentDateValue) return false;
      return isSameDay(new Date(appointmentDateValue), selectedDate);
    }
  );

  const statusSummary = appointmentsOnSelectedDate.reduce(
    (acc, appointment) => {
      const status = (appointment.status || "PENDING").toUpperCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { BOOKED: 0, PENDING: 0, CANCELLED: 0, COMPLETED: 0 }
  );

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(startOfDay(new Date()));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            My Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and update your appointments in real-time
          </Typography>
        </Box>

        <Box
          sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" } }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search by patient or reason"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            size="small"
            label="Filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="BOOKED">Booked</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>
        </Box>
      </Box>

      <Paper
        sx={{
          mt: 3,
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="h6">{format(selectedDate, "PPPP")}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={handlePreviousDay}>
              Previous
            </Button>
            <Button variant="outlined" size="small" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outlined" size="small" onClick={handleNextDay}>
              Next
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={`Booked: ${statusSummary.BOOKED || 0}`}
            color="success"
            size="small"
          />
          <Chip
            label={`Pending: ${statusSummary.PENDING || 0}`}
            color="warning"
            size="small"
          />
          <Chip
            label={`Cancelled: ${statusSummary.CANCELLED || 0}`}
            color="error"
            size="small"
          />
          <Chip
            label={`Completed: ${statusSummary.COMPLETED || 0}`}
            color="info"
            size="small"
          />
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : appointmentsOnSelectedDate.length > 0 ? (
        <AppointmentsTable
          appointments={appointmentsOnSelectedDate}
          onStatusUpdate={handleStatusUpdate}
        />
      ) : (
        <Paper sx={{ p: 4, textAlign: "center", mt: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No appointments scheduled for this date
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try another date, adjust filters, or change your search criteria
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DoctorAppointments;
