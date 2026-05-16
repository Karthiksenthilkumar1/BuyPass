import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding movies...");

  const movies = [
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      language: "English",
      genre: "Sci-Fi",
      durationMinutes: 148,
      releaseDate: new Date("2010-07-16"),
      posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvmHnTPhsy.jpg",
    },
    {
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
      language: "English",
      genre: "Sci-Fi",
      durationMinutes: 166,
      releaseDate: new Date("2024-03-01"),
      posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcNsV.jpg",
    },
    {
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      language: "English",
      genre: "Biography",
      durationMinutes: 180,
      releaseDate: new Date("2023-07-21"),
      posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    }
  ];

  for (const movie of movies) {
    await prisma.movie.create({
      data: movie
    });
  }

  console.log("Seeding movies complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
