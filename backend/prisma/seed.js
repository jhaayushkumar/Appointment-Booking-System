import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database..");
  await prisma.payment.deleteMany();
  await prisma.cancellation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();

  const hashedPatientPassword = await bcrypt.hash("password123", 10);
  const hashedDoctorPassword = await bcrypt.hash("doctor123", 10);

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: "John Doe",
        age: 30,
        gender: "Male",
        phone: "9876543210",
        email: "john@example.com",
        password: hashedPatientPassword,
      },
    }),
    prisma.patient.create({
      data: {
        name: "Jane Smith",
        age: 28,
        gender: "Female",
        phone: "9876500001",
        email: "jane@example.com",
        password: hashedPatientPassword,
      },
    }),
    prisma.patient.create({
      data: {
        name: "Mark Wilson",
        age: 35,
        gender: "Male",
        phone: "9876500002",
        email: "mark@example.com",
        password: hashedPatientPassword,
      },
    }),
    prisma.patient.create({
      data: {
        name: "Ava Patel",
        age: 32,
        gender: "Female",
        phone: "9876500003",
        email: "ava@example.com",
        password: hashedPatientPassword,
      },
    }),
    prisma.patient.create({
      data: {
        name: "Leo Chen",
        age: 40,
        gender: "Male",
        phone: "9876500004",
        email: "leo@example.com",
        password: hashedPatientPassword,
      },
    }),
    prisma.patient.create({
      data: {
        name: "Mia Lopez",
        age: 26,
        gender: "Female",
        phone: "9876500005",
        email: "mia@example.com",
        password: hashedPatientPassword,
      },
    }),
  ]);

  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: "Emily Carter",
        specialization: "Cardiology",
        phone: "9998887777",
        email: "drsmith@example.com",
        password: hashedDoctorPassword,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Alex Johnson",
        specialization: "Dermatology",
        phone: "9998881111",
        email: "dralex@example.com",
        password: hashedDoctorPassword,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Priya Menon",
        specialization: "Pediatrics",
        phone: "9998882222",
        email: "drpriya@example.com",
        password: hashedDoctorPassword,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Ryan Patel",
        specialization: "Orthopedics",
        phone: "9998883333",
        email: "drryan@example.com",
        password: hashedDoctorPassword,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Sara Lee",
        specialization: "Neurology",
        phone: "9998884444",
        email: "drsara@example.com",
        password: hashedDoctorPassword,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Michael Brown",
        specialization: "General Medicine",
        phone: "9998885555",
        email: "drmichael@example.com",
        password: hashedDoctorPassword,
      },
    }),
  ]);

  const now = new Date();
  const createSlotTime = (daysFromNow, hours, minutes = 0) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() + daysFromNow);
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
  };

  const slots = await prisma.$transaction([
    prisma.slot.create({
      data: {
        startTime: createSlotTime(-1, 9),
        endTime: createSlotTime(-1, 9, 30),
        doctorId: doctors[0].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(0, 10),
        endTime: createSlotTime(0, 10, 30),
        doctorId: doctors[0].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(1, 11),
        endTime: createSlotTime(1, 11, 30),
        doctorId: doctors[1].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(1, 13),
        endTime: createSlotTime(1, 13, 30),
        doctorId: doctors[1].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(2, 9),
        endTime: createSlotTime(2, 9, 30),
        doctorId: doctors[2].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(2, 10, 30),
        endTime: createSlotTime(2, 11),
        doctorId: doctors[2].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(3, 8),
        endTime: createSlotTime(3, 8, 30),
        doctorId: doctors[3].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(3, 14),
        endTime: createSlotTime(3, 14, 30),
        doctorId: doctors[3].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(4, 13),
        endTime: createSlotTime(4, 13, 30),
        doctorId: doctors[4].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(4, 15),
        endTime: createSlotTime(4, 15, 30),
        doctorId: doctors[4].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(5, 9, 30),
        endTime: createSlotTime(5, 10),
        doctorId: doctors[5].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(5, 11),
        endTime: createSlotTime(5, 11, 30),
        doctorId: doctors[5].id,
      },
    }),
    prisma.slot.create({
      data: {
        startTime: createSlotTime(1, 15),
        endTime: createSlotTime(1, 15, 30),
        doctorId: doctors[0].id,
      },
    }),
  ]);

  const appointments = await prisma.$transaction([
    prisma.appointment.create({
      data: {
        date: slots[0].startTime,
        status: "BOOKED",
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        slotId: slots[0].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: slots[1].startTime,
        status: "PENDING",
        patientId: patients[1].id,
        doctorId: doctors[0].id,
        slotId: slots[1].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: slots[2].startTime,
        status: "BOOKED",
        patientId: patients[0].id,
        doctorId: doctors[1].id,
        slotId: slots[2].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: slots[4].startTime,
        status: "PENDING",
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        slotId: slots[4].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: slots[6].startTime,
        status: "BOOKED",
        patientId: patients[3].id,
        doctorId: doctors[3].id,
        slotId: slots[6].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: slots[8].startTime,
        status: "PENDING",
        patientId: patients[4].id,
        doctorId: doctors[4].id,
        slotId: slots[8].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: slots[10].startTime,
        status: "BOOKED",
        patientId: patients[5].id,
        doctorId: doctors[5].id,
        slotId: slots[10].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: slots[12].startTime,
        status: "BOOKED",
        patientId: patients[2].id,
        doctorId: doctors[0].id,
        slotId: slots[12].id,
      },
    }),
  ]);

  await prisma.payment.create({
    data: {
      amount: 700,
      method: "Card",
      appointmentId: appointments[0].id,
    },
  });

  await prisma.cancellation.create({
    data: {
      reason: "Patient requested reschedule",
      appointmentId: appointments[1].id,
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
