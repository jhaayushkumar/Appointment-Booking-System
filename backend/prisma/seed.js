const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const patient = await prisma.patient.create({
    data: {
      name: "Devendra",
      age: 20,
      gender: "Male",
      phone: "9876543210",
      email: "dm300990011@example.com",
    }
  });

  const doctor = await prisma.doctor.create({
    data: {
      name: "Dr. Sharma",
      specialization: "Cardiology",
      phone: "9112345670",
      email: "deve200009990131@example.com",
    }
  });

  const slot = await prisma.slot.create({
    data: {
      startTime: new Date("2025-10-05T10:00:00"),
      endTime: new Date("2025-10-05T10:30:00"),
      doctorId: doctor.id
    }
  });

  const appointment = await prisma.appointment.create({
    data: {
      date: new Date("2025-10-05T10:00:00"),
      status: "BOOKED",
      patientId: patient.id,
      doctorId: doctor.id,
      slotId: slot.id
    }
  });

  await prisma.payment.create({
    data: {
      amount: 500,
      method: "UPI",
      appointmentId: appointment.id
    }
  });

  await prisma.cancellation.create({
    data: {
      reason: "Feeling better",
      appointmentId: appointment.id
    }
  });

  console.log("Seed done!👍🏾");
}

main()
  .catch(e => console.log(e))
  .finally(() => prisma.$disconnect());
