import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

async function run() {
  try {
    const owner = await prisma.user.findFirst({ where: { role: "THEATRE_OWNER" } });
    if (!owner) return console.log("No owner");
    
    console.log("Generating token for owner:", owner.email);
    const token = generateToken({ id: owner.id, email: owner.email, role: owner.role });

    const theatre = await prisma.theatre.findFirst({ where: { ownerId: owner.id } });
    if(!theatre) return console.log("No theatre");

    const screen = await prisma.screen.findFirst({ where: { theatreId: theatre.id } });
    if(!screen) return console.log("No screen");

    const movie = await prisma.movie.findFirst();
    if(!movie) return console.log("No movie");

    console.log("Posting to /api/shows...");
    const showRes = await fetch("http://localhost:4000/api/shows", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({
        screenId: screen.id,
        movieId: movie.id,
        startTime: new Date().toISOString(),
        basePrice: 150
      })
    });

    const text = await showRes.text();
    console.log("Status:", showRes.status);
    console.log("Response:", text);

  } catch(e: any) {
    console.error("Error Message:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
