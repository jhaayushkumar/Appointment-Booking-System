import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Avatar,
  Divider,
  Paper,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Search,
  LocalHospital,
  Phone,
  Email,
  CalendarMonth,
  Schedule,
  CheckCircle,
} from "@mui/icons-material";
import { format } from "date-fns";
import { getPatientDoctors, bookPatientAppointment } from "../api/patient.api";
import toast from "react-hot-toast";

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPatientDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Failed to load doctors", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const specializations = useMemo(() => {
    const allSpecs = doctors.map(
      (doctor) => doctor.specialization || "General"
    );
    return Array.from(new Set(allSpecs));
  }, [doctors]);

  const specialtyStats = useMemo(() => {
    const statsMap = doctors.reduce((acc, doctor) => {
      const spec = doctor.specialization || "General";
      const availableSlots = doctor.slots?.length || 0;
      if (!acc[spec]) {
        acc[spec] = { name: spec, count: 0, availableSlots: 0 };
      }
      acc[spec].count += 1;
      acc[spec].availableSlots += availableSlots;
      return acc;
    }, {});
    return Object.values(statsMap);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (specializationFilter === "all") return doctors;
    return doctors.filter(
      (doctor) => (doctor.specialization || "General") === specializationFilter
    );
  }, [doctors, specializationFilter]);

  const availabilityFilteredDoctors = useMemo(() => {
    if (!showAvailableOnly) return filteredDoctors;
    return filteredDoctors.filter((doctor) => (doctor.slots?.length || 0) > 0);
  }, [filteredDoctors, showAvailableOnly]);

  const searchFilteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return availabilityFilteredDoctors;
    const query = searchQuery.toLowerCase();
    return availabilityFilteredDoctors.filter(
      (doctor) =>
        doctor.name?.toLowerCase().includes(query) ||
        doctor.specialization?.toLowerCase().includes(query) ||
        doctor.email?.toLowerCase().includes(query)
    );
  }, [availabilityFilteredDoctors, searchQuery]);

  const handleOpenBooking = (doctor, slot) => {
    setSelectedSlot({ doctor, slot });
  };

  const handleCloseBooking = () => {
    setSelectedSlot(null);
    setBooking(false);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    try {
      const slotStart = selectedSlot.slot.startTime || selectedSlot.slot.start;
      await bookPatientAppointment({
        doctorId: selectedSlot.doctor.id,
        slotId: selectedSlot.slot.id,
        date: slotStart,
      });
      toast.success("Appointment booking request sent successfully!");
      handleCloseBooking();
      fetchDoctors();
    } catch (error) {
      console.error("Failed to book appointment", error);
      toast.error("Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const renderSlots = (doctor) => {
    if (!doctor.slots?.length) {
      return (
        <Typography color="text.secondary" variant="body2">
          No available slots
        </Typography>
      );
    }

    const displaySlots = doctor.slots.slice(0, 3);
    const remainingCount = doctor.slots.length - 3;

    return (
      <Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={1}>
          {displaySlots.map((slot) => {
            const start = format(new Date(slot.startTime), "MMM dd, h:mm a");
            return (
              <Chip
                key={slot.id}
                label={start}
                onClick={() => handleOpenBooking(doctor, slot)}
                color="primary"
                variant="outlined"
                size="small"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              />
            );
          })}
        </Stack>
        {remainingCount > 0 && (
          <Typography variant="caption" color="text.secondary">
            +{remainingCount} more slot{remainingCount > 1 ? "s" : ""} available
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Find a Doctor
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Browse doctors by specialty and book appointments
      </Typography>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name, specialty, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Specialization"
              value={specializationFilter}
              onChange={(event) => setSpecializationFilter(event.target.value)}
              size="small"
            >
              <MenuItem value="all">All Specializations</MenuItem>
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec || "General"}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAvailableOnly}
                  onChange={(event) =>
                    setShowAvailableOnly(event.target.checked)
                  }
                />
              }
              label="Show only available doctors"
            />
          </Grid>
        </Grid>
      </Paper>

      {specialtyStats.length > 0 && !searchQuery && (
        <Box mb={4}>
          <Typography variant="h5" mb={2} fontWeight={600}>
            Browse by Specialties
          </Typography>
          <Grid container spacing={2}>
            {specialtyStats.map((spec) => (
              <Grid item xs={12} sm={6} md={3} key={spec.name}>
                <Card
                  onClick={() => setSpecializationFilter(spec.name)}
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                        <LocalHospital />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {spec.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {spec.count} doctor{spec.count === 1 ? "" : "s"}
                    </Typography>
                    <Box mt="auto">
                      <Chip
                        label={`${spec.availableSlots} slot${
                          spec.availableSlots === 1 ? "" : "s"
                        }`}
                        size="small"
                        color={spec.availableSlots > 0 ? "success" : "default"}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : searchFilteredDoctors.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
          <LocalHospital sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No doctors found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h5" mb={2} fontWeight={600}>
            Available Doctors ({searchFilteredDoctors.length})
          </Typography>
          <Grid container spacing={3}>
            {searchFilteredDoctors.map((doctor) => (
              <Grid item xs={12} md={6} lg={4} key={doctor.id}>
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
                    <Stack direction="row" spacing={2} mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 56,
                          height: 56,
                        }}
                      >
                        {doctor.name?.charAt(0) || "D"}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          Dr. {doctor.name}
                        </Typography>
                        <Chip
                          label={doctor.specialization || "General"}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.phone}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mb={1}
                      >
                        <CalendarMonth fontSize="small" color="primary" />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Available Slots
                        </Typography>
                      </Stack>
                      {renderSlots(doctor)}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Dialog
        open={Boolean(selectedSlot)}
        onClose={handleCloseBooking}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            Book Appointment
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <Box sx={{ pt: 2 }}>
              {/* Doctor Info Card */}
              <Paper elevation={0} sx={{ bgcolor: "primary.light", p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", width: 60, height: 60 }}>
                    {selectedSlot.doctor.name?.charAt(0) || "D"}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600}>
                      Dr. {selectedSlot.doctor.name}
                    </Typography>
                    <Chip
                      label={selectedSlot.doctor.specialization || "General"}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Stack>
              </Paper>

              {/* Appointment Details */}
              <Paper elevation={0} sx={{ bgcolor: "background.default", p: 2, mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  APPOINTMENT DETAILS
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonth color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(selectedSlot.slot.startTime), "PPPP")}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Schedule color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(selectedSlot.slot.startTime), "p")} -{" "}
                          {format(new Date(selectedSlot.slot.endTime), "p")}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Email color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedSlot.doctor.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Phone color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedSlot.doctor.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Important Note */}
              <Paper
                elevation={0}
                sx={{ bgcolor: "warning.light", p: 2, borderLeft: 4, borderColor: "warning.main" }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  📋 Important Information
                </Typography>
                <Typography variant="body2">
                  • Your appointment request will be sent to the doctor for confirmation
                  <br />
                  • You will be notified once the doctor confirms your appointment
                  <br />
                  • Please arrive 10 minutes before your scheduled time
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseBooking} disabled={booking} size="large">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={booking}
            size="large"
            startIcon={booking ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDoctors;
