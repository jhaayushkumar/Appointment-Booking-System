import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database..");
  await prisma.payment.deleteMany();
  await prisma.cancellation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();

  const patient1 = await prisma.patient.create({
    data: {
      name: "John Doe",
      age: 30,
      gender: "Male",
      phone: "9876543210",
      email: "john@example.com",
      password: "password123",
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: "Priya Sharma",
      age: 27,
      gender: "Female",
      phone: "9123456780",
      email: "priya@example.com",
      password: "priya123",
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      name: "Amit Verma",
      age: 45,
      gender: "Male",
      phone: "9090909090",
      email: "amit@example.com",
      password: "amitpass",
    },
  });

  const patient4 = await prisma.patient.create({
    data: {
      name: "Riya Mehta",
      age: 22,
      gender: "Female",
      phone: "9000011111",
      email: "riya@example.com",
      password: "riya@123",
    },
  });

  const doctor1 = await prisma.doctor.create({
    data: {
      name: "Dr. Smith",
      specialization: "Cardiology",
      phone: "9998887777",
      email: "drsmith@example.com",
      password: "docpass123",
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      name: "Dr. Rohan Mehta",
      specialization: "Dermatology",
      phone: "8887776666",
      email: "drrohan@example.com",
      password: "rohan123",
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      name: "Dr. Nikita Rao",
      specialization: "Orthopedics",
      phone: "7776665555",
      email: "drnikita@example.com",
      password: "nikita123",
    },
  });

  const slot1 = await prisma.slot.create({
    data: {
      startTime: new Date("2025-10-30T10:00:00Z"),
      endTime: new Date("2025-10-30T10:30:00Z"),
      doctorId: doctor1.id,
    },
  });

  const slot2 = await prisma.slot.create({
    data: {
      startTime: new Date("2025-10-30T11:00:00Z"),
      endTime: new Date("2025-10-30T11:30:00Z"),
      doctorId: doctor2.id,
    },
  });

  const slot3 = await prisma.slot.create({
    data: {
      startTime: new Date("2025-11-02T09:00:00Z"),
      endTime: new Date("2025-11-02T09:30:00Z"),
      doctorId: doctor3.id,
    },
  });

  const slot4 = await prisma.slot.create({
    data: {
      startTime: new Date("2025-11-05T14:00:00Z"),
      endTime: new Date("2025-11-05T14:30:00Z"),
      doctorId: doctor1.id,
    },
  });

  const appointment1 = await prisma.appointment.create({
    data: {
      date: new Date("2025-10-30T10:00:00Z"),
      status: "BOOKED",
      patientId: patient1.id,
      doctorId: doctor1.id,
      slotId: slot1.id,
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      date: new Date("2025-10-30T11:00:00Z"),
      status: "BOOKED",
      patientId: patient2.id,
      doctorId: doctor2.id,
      slotId: slot2.id,
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      date: new Date("2025-11-02T09:00:00Z"),
      status: "BOOKED",
      patientId: patient3.id,
      doctorId: doctor3.id,
      slotId: slot3.id,
    },
  });

  const appointment4 = await prisma.appointment.create({
    data: {
      date: new Date("2025-11-05T14:00:00Z"),
      status: "BOOKED",
      patientId: patient4.id,
      doctorId: doctor1.id,
      slotId: slot4.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 500,
      method: "Cash",
      paymentDate: new Date(),
      appointmentId: appointment1.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 700,
      method: "Card",
      paymentDate: new Date(),
      appointmentId: appointment2.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 600,
      method: "UPI",
      paymentDate: new Date(),
      appointmentId: appointment3.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 900,
      method: "Cash",
      paymentDate: new Date(),
      appointmentId: appointment4.id,
    },
  });

  await prisma.cancellation.create({
    data: {
      reason: "Patient not feeling well",
      cancelledAt: new Date(),
      appointmentId: appointment1.id,
    },
  });

  await prisma.cancellation.create({
    data: {
      reason: "Doctor not available",
      cancelledAt: new Date(),
      appointmentId: appointment2.id,
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
