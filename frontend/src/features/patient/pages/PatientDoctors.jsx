import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
} from "@mui/material";
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
      return <Typography color="text.secondary">No slots available</Typography>;
    }

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {doctor.slots.map((slot) => {
          const start = format(new Date(slot.startTime), "PPp");
          const end = format(new Date(slot.endTime), "pp");
          return (
            <Chip
              key={slot.id}
              label={`${start} - ${end}`}
              onClick={() => handleOpenBooking(doctor, slot)}
              color="primary"
              variant="outlined"
              sx={{ cursor: "pointer" }}
            />
          );
        })}
      </Stack>
    );
  };

  return (
    <Box p={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        mb={3}
      >
        <Typography variant="h4">Find a Doctor</Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          width={{ xs: "100%", md: "auto" }}
        >
          <TextField
            select
            label="Specialization"
            value={specializationFilter}
            onChange={(event) => setSpecializationFilter(event.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All specializations</MenuItem>
            {specializations.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec || "General"}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={showAvailableOnly}
                onChange={(event) => setShowAvailableOnly(event.target.checked)}
              />
            }
            label="Show only doctors with available slots"
          />
        </Stack>
      </Stack>

      {specialtyStats.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" mb={2}>
            Browse by Specialties
          </Typography>
          <Grid container spacing={2}>
            {specialtyStats.map((spec) => (
              <Grid item xs={12} sm={6} md={4} key={spec.name}>
                <Card
                  onClick={() => setSpecializationFilter(spec.name)}
                  sx={{ cursor: "pointer" }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {spec.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {spec.count} doctor{spec.count === 1 ? "" : "s"}
                    </Typography>
                    <Chip
                      label={`${spec.availableSlots} available slot${
                        spec.availableSlots === 1 ? "" : "s"
                      }`}
                      size="small"
                      color={spec.availableSlots > 0 ? "success" : "default"}
                      sx={{ mt: 1 }}
                    />
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
      ) : availabilityFilteredDoctors.length === 0 ? (
        <Typography>No doctors available.</Typography>
      ) : (
        <Grid container spacing={3}>
          {availabilityFilteredDoctors.map((doctor) => (
            <Grid item xs={12} md={6} key={doctor.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Dr. {doctor.name}</Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {doctor.specialization}
                  </Typography>
                  <Typography variant="body2">Email: {doctor.email}</Typography>
                  <Typography variant="body2" gutterBottom>
                    Phone: {doctor.phone}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Available Slots
                  </Typography>
                  {renderSlots(doctor)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={Boolean(selectedSlot)} onClose={handleCloseBooking}>
        <DialogTitle>Booking Request</DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Dr. {selectedSlot.doctor.name} (
                {selectedSlot.doctor.specialization})
              </Typography>
              <Typography>
                Slot: {format(new Date(selectedSlot.slot.startTime), "PPpp")} -{" "}
                {format(new Date(selectedSlot.slot.endTime), "pp")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBooking}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={booking}
          >
            {booking ? "Booking..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDoctors;
