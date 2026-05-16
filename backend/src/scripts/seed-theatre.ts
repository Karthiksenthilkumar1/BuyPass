import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  try {
    const owner = await prisma.user.findFirst({ where: { role: "THEATRE_OWNER" } });
    if (!owner) return console.log("No owner");
    
    let theatre = await prisma.theatre.findFirst({ where: { ownerId: owner.id } });
    if (!theatre) {
      theatre = await prisma.theatre.create({
        data: {
          name: "Owner Theatre",
          city: "Test City",
          location: "Test Location",
          ownerId: owner.id
        }
      });
      console.log("Created Theatre:", theatre.id);
    }

    let screen = await prisma.screen.findFirst({ where: { theatreId: theatre.id } });
    if (!screen) {
      screen = await prisma.screen.create({
        data: {
          name: "Screen 1",
          format: "2D",
          totalCapacity: 100,
          theatreId: theatre.id
        }
      });
      console.log("Created Screen:", screen.id);
    }
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
