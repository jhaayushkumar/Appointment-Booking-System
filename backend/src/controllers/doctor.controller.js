const prisma = require("../config/db.config.js");

const getMyAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            age: true,
            gender: true
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

const updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'BOOKED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId !== doctorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        patient: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return res.status(200).json({ 
      message: "Appointment status updated successfully",
      appointment: updatedAppointment 
    });
  } catch (error) {
    console.error('Update Appointment Status Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createSlot = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Start time and end time are required" });
    }

    const slot = await prisma.slot.create({
      data: {
        doctorId,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    });

    return res.status(201).json({ 
      message: "Slot created successfully",
      slot 
    });
  } catch (error) {
    console.error('Create Slot Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getMySlots = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const slots = await prisma.slot.findMany({
      where: { doctorId },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    return res.status(200).json({ slots });
  } catch (error) {
    console.error('Get Slots Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { id } = req.params;

    const slot = await prisma.slot.findUnique({
      where: { id: parseInt(id) },
      include: { appointment: true }
    });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.doctorId !== doctorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (slot.appointment) {
      return res.status(400).json({ message: "Cannot delete slot with existing appointment" });
    }

    await prisma.slot.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error('Delete Slot Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialization: true
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { name, phone, specialization } = req.body;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(specialization && { specialization })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialization: true
      }
    });

    return res.status(200).json({ 
      message: "Profile updated successfully",
      doctor: updatedDoctor 
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyPatients = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            age: true,
            gender: true
          }
        }
      },
      distinct: ['patientId']
    });

    const patients = appointments.map(apt => apt.patient);
    return res.status(200).json({ patients });
  } catch (error) {
    console.error('Get Patients Error:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getMyAppointments,
  updateAppointmentStatus,
  createSlot,
  getMySlots,
  deleteSlot,
  getMyProfile,
  updateMyProfile,
  getMyPatients
};
