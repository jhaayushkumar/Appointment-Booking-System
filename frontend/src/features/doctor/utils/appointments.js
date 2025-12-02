export const normalizeAppointments = (rawAppointments = []) =>
  rawAppointments.map((appointment) => {
    const patient = appointment.patient || {};
    const slot = appointment.slot || {};

    const status = (appointment.status || "PENDING").toUpperCase();

    return {
      ...appointment,
      patientName: patient.name || appointment.patientName || "Unknown",
      patientPhone: patient.phone || appointment.patientPhone || "N/A",
      date: appointment.date || slot.startTime || appointment.dateTime,
      dateTime: appointment.date || slot.startTime || appointment.dateTime,
      status,
      reason:
        appointment.reason || appointment.purpose || "General Consultation",
    };
  });
