import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding booking data...");

  // 1. Find Inception Movie
  const movie = await prisma.movie.findFirst({
    where: { title: "Inception" },
  });

  if (!movie) {
    console.error("Movie 'Inception' not found. Please run movie management verification first.");
    return;
  }

  // 2. Create Theatre
  const theatre = await prisma.theatre.create({
    data: {
      name: "Grand Cinema",
      city: "Mumbai",
      location: "Bandra West",
    },
  });

  // 3. Create Screen
  const screen = await prisma.screen.create({
    data: {
      name: "Audi 1",
      format: "IMAX",
      totalCapacity: 100,
      theatreId: theatre.id,
    },
  });

  // 4. Create Seats (10x10 Grid)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsData = [];

  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      seatsData.push({
        screenId: screen.id,
        row: row,
        number: i,
        category: row === "J" || row === "I" ? "Premium" : "Standard",
        priceMultiplier: row === "J" || row === "I" ? 1.5 : 1.0,
      });
    }
  }

  await prisma.seat.createMany({
    data: seatsData,
  });

  // 5. Create Show
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 2); // Show starts in 2 hours

  const show = await prisma.show.create({
    data: {
      movieId: movie.id,
      screenId: screen.id,
      startTime: startTime,
      basePrice: 250,
    },
  });

  console.log("Seeding complete!");
  console.log(`Theatre: ${theatre.name}`);
  console.log(`Screen: ${screen.name}`);
  console.log(`Show ID: ${show.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
