import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  setHours,
  setMinutes,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  getDoctorAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
} from "../api/doctor.api";
import toast from "react-hot-toast";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const mergeDateTime = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return null;
  let merged = new Date(dateValue);
  merged = setHours(merged, timeValue.getHours());
  merged = setMinutes(merged, timeValue.getMinutes());
  return merged;
};

const AvailabilityCalendar = ({ doctorId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctorAvailability();
      const mapped = data
        .filter((slot) => {
          const appointmentStatus = (
            slot.appointment?.status || ""
          ).toUpperCase();
          return appointmentStatus !== "COMPLETED";
        })
        .map((slot) => {
          const start = new Date(slot.startTime);
          const end = new Date(slot.endTime);
          const appointmentStatus = (
            slot.appointment?.status || ""
          ).toUpperCase();

          let title = "Available";
          if (appointmentStatus === "BOOKED") {
            title = `Booked ${slot.appointment?.patient?.name ?? ""}`;
          } else if (appointmentStatus === "PENDING") {
            title = "Pending Confirmation";
          } else if (appointmentStatus === "CANCELLED") {
            title = "Cancelled";
          }

          return {
            id: slot.id,
            title,
            start,
            end,
            allDay: false,
            resource: slot,
          };
        });
      setEvents(mapped);
    } catch (error) {
      console.error("Error loading availability", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setConfirmDeleteOpen(true);
  }, []);

  const handleDeleteSlot = useCallback(async () => {
    if (!selectedEvent) return;

    const isBooked = Boolean(selectedEvent.resource?.appointment?.status === "BOOKED");
    if (isBooked) {
      toast.error("Cannot delete a booked slot");
      return;
    }

    try {
      await deleteAvailabilitySlot(selectedEvent.id);
      setConfirmDeleteOpen(false);
      setSelectedEvent(null);
      fetchSlots();
      toast.success("Slot deleted");
    } catch (error) {
      console.error("Failed to delete slot", error);
      toast.error("Unable to delete slot");
    }
  }, [selectedEvent, fetchSlots]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleAddSlot = async () => {
    const start = mergeDateTime(startDate, startTime);
    const end = mergeDateTime(endDate, endTime);

    if (!start || !end || end <= start) {
      toast.error("Please provide a valid start and end time");
      return;
    }

    try {
      await addAvailabilitySlot({ startTime: start, endTime: end, doctorId });
      setOpen(false);
      fetchSlots();
      toast.success("Slot added");
    } catch (error) {
      console.error("Failed to add slot", error);
      toast.error("Unable to add slot");
    }
  };

  const eventPropGetter = useMemo(() => {
    const statusColors = {
      BOOKED: "#2E7D32", // green
      CANCELLED: "#D32F2F", // red
      PENDING: "#ED6C02", // orange
    };

    return (event) => {
      const status = (event.resource?.appointment?.status || "").toUpperCase();
      const backgroundColor = statusColors[status] || "#4CAF50";

      return {
        style: {
          backgroundColor,
          borderRadius: 6,
          opacity: 0.9,
        },
      };
    };
  }, []);

  if (loading) {
    return <Typography>Loading availability...</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Availability Calendar
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Slot
        </Button>
      </Box>

      <Box sx={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["day", "week"]}
          view={currentView}
          onView={(view) => setCurrentView(view)}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onSelectEvent={handleSelectEvent}
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
          style={{ height: "100%" }}
          eventPropGetter={eventPropGetter}
        />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Availability Slot</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={setEndTime}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSlot}>
            Save Slot
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setSelectedEvent(null);
        }}
      >
        <DialogTitle>Slot Details</DialogTitle>
        <DialogContent>
          {selectedEvent ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {selectedEvent.title}
              </Typography>
              <Typography variant="body2">
                Start: {selectedEvent.start.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                End: {selectedEvent.end.toLocaleString()}
              </Typography>
              {selectedEvent.resource?.appointment?.status === "BOOKED" ? (
                <Typography color="error">
                  This slot is booked and cannot be deleted.
                </Typography>
              ) : (
                <Typography color="text.secondary">
                  This slot is{" "}
                  {selectedEvent.resource?.appointment?.status?.toLowerCase()}.
                  You can delete it.
                </Typography>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmDeleteOpen(false);
              setSelectedEvent(null);
            }}
          >
            Close
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteSlot}
            disabled={Boolean(
              selectedEvent?.resource?.appointment?.status === "BOOKED"
            )}
          >
            Delete Slot
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AvailabilityCalendar;
