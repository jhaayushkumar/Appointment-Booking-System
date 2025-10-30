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


  const hashedPatientPassword = await bcrypt.hash("password123", 10);

  const patient1 = await prisma.patient.create({
    data: {
      name: "John Doe",
      age: 30,
      gender: "Male",
      phone: "9876543210",
      email: "john@example.com",
      password: hashedPatientPassword,
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


  const slot1 = await prisma.slot.create({
    data: {
      startTime: new Date("2025-10-30T10:00:00Z"),
      endTime: new Date("2025-10-30T10:30:00Z"),
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


  await prisma.payment.create({
    data: {
      amount: 500,
      method: "Cash",
      paymentDate: new Date(),
      appointmentId: appointment1.id,

    },
  });
  await prisma.cancellation.create({
  data: {
    reason: "Patient not feeling well",
    cancelledAt: new Date(),
    appointmentId: appointment1.id,
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

