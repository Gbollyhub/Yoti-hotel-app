import "dotenv/config";
import { addDays } from "date-fns";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";

function dateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

async function main() {
  await prisma.review.deleteMany();
  await prisma.bookingDinner.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.admin.deleteMany();

  const [single, double, suite] = await Promise.all([
    prisma.room.create({
      data: {
        name: "Harbor Single",
        description: "A cozy room with a harbor view, perfect for solo travelers.",
        pricePerNightCents: 9000,
        capacity: 1,
      },
    }),
    prisma.room.create({
      data: {
        name: "Garden Double",
        description: "A bright double room overlooking the garden courtyard.",
        pricePerNightCents: 13000,
        capacity: 2,
      },
    }),
    prisma.room.create({
      data: {
        name: "Rooftop Suite",
        description: "Our largest room, with a private rooftop terrace.",
        pricePerNightCents: 21000,
        capacity: 2,
      },
    }),
  ]);

  await prisma.admin.createMany({
    data: [
      { email: "admin@yoti-hotel.com", passwordHash: await hashPassword("admin1234") },
      { email: "manager@yoti-hotel.com", passwordHash: await hashPassword("admin1234") },
    ],
  });

  const today = dateOnly(new Date());

  // Currently active: check-in was yesterday, checks out in 2 days.
  await prisma.booking.create({
    data: {
      confirmationCode: "ACTIVE01",
      roomId: double.id,
      checkIn: addDays(today, -1),
      checkOut: addDays(today, 2),
      guests: 2,
      guestName: "Guest 1",
      guestEmail: "guest1@example.com",
    },
  });

  // Future booking, not due to arrive for a couple of weeks.
  await prisma.booking.create({
    data: {
      confirmationCode: "FUTURE01",
      roomId: single.id,
      checkIn: addDays(today, 14),
      checkOut: addDays(today, 17),
      guests: 1,
      guestName: "Guest 2",
      guestEmail: "guest2@example.com",
    },
  });

  // Ended a week ago: eligible for a review (last day is in the past).
  await prisma.booking.create({
    data: {
      confirmationCode: "PASTSTAY",
      roomId: suite.id,
      checkIn: addDays(today, -10),
      checkOut: addDays(today, -7),
      guests: 2,
      guestName: "Guest 3",
      guestEmail: "guest3@example.com",
    },
  });

  // Cancelled booking, should be excluded from availability checks.
  await prisma.booking.create({
    data: {
      confirmationCode: "CANCEL01",
      roomId: double.id,
      checkIn: addDays(today, 5),
      checkOut: addDays(today, 8),
      guests: 1,
      guestName: "Guest 4",
      guestEmail: "guest4@example.com",
      status: "CANCELLED",
    },
  });

  // Upcoming stay with dinner nights already configured.
  await prisma.booking.create({
    data: {
      confirmationCode: "DINNER01",
      roomId: suite.id,
      checkIn: addDays(today, 3),
      checkOut: addDays(today, 6),
      guests: 2,
      guestName: "Guest 5",
      guestEmail: "guest5@example.com",
      dinners: {
        create: [
          { date: addDays(today, 3), hasDinner: true },
          { date: addDays(today, 4), hasDinner: false },
          { date: addDays(today, 5), hasDinner: true },
        ],
      },
    },
  });

  console.log("Seeded 3 rooms, 2 admins, 5 bookings.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
