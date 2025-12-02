const prisma = require("../config/db.config.js");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialization: true,
        slots: {
          where: {
            appointment: null
          },
          select: {
            id: true,
            startTime: true,
            endTime: true
          }
        }
      }
    });
    return res.status(200).json({ doctors });
  } catch (error) {
    console.error('Get Doctors Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.patient.id;
    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            email: true,
            phone: true
          }
        },
        slot: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error('Get Appointments Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const patientId = req.patient.id;
    const { doctorId, slotId, date } = req.body;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Doctor ID and date are required" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (slotId) {
      const slot = await prisma.slot.findUnique({
        where: { id: parseInt(slotId) },
        include: { appointment: true }
      });

      if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
      }

      if (slot.appointment) {
        return res.status(400).json({ message: "Slot already booked" });
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId: parseInt(doctorId),
        slotId: slotId ? parseInt(slotId) : null,
        date: new Date(date),
        status: 'PENDING'
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true
          }
        }
      }
    });

    return res.status(201).json({ 
      message: "Appointment booked successfully",
      appointment 
    });
  } catch (error) {
    console.error('Book Appointment Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const patientId = req.patient.id;
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId !== patientId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if already cancelled
    if (appointment.status === 'CANCELLED') {
      return res.status(400).json({ message: "Appointment already cancelled" });
    }

    // Update appointment status to CANCELLED
    await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELLED' }
    });

    // Create cancellation record
    await prisma.cancellation.create({
      data: {
        appointmentId: parseInt(id),
        reason: reason || "No reason provided"
      }
    });

    return res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error('Cancel Appointment Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const patientId = req.patient.id;
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        gender: true
      }
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const patientId = req.patient.id;
    const { name, phone, age, gender } = req.body;

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(age && { age: parseInt(age) }),
        ...(gender && { gender })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        gender: true
      }
    });

    return res.status(200).json({ 
      message: "Profile updated successfully",
      patient: updatedPatient 
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { 
  getAllDoctors,
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  getMyProfile,
  updateMyProfile
};
