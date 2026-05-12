import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

// Define the include type for type-safe access to relations
const showInclude = {
  movie: true,
  screen: {
    include: {
      theatre: true,
      seats: {
        orderBy: [
          { row: "asc" as const },
          { number: "asc" as const },
        ],
      },
    },
  },
  bookings: {
    where: { status: "CONFIRMED" as const },
    include: {
      tickets: true,
    },
  },
} satisfies Prisma.ShowInclude;

export const getShowDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const show = await prisma.show.findUnique({
      where: { id },
      include: showInclude,
    });

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Map booked seat IDs
    const bookedSeatIds = new Set(
      show.bookings.flatMap((b) => b.tickets.map((t) => t.seatId))
    );

    // Format the response
    const formattedShow = {
      id: show.id,
      movie: show.movie,
      startTime: show.startTime,
      basePrice: show.basePrice,
      theatre: show.screen.theatre,
      screen: {
        id: show.screen.id,
        name: show.screen.name,
        format: show.screen.format,
      },
      seats: show.screen.seats.map((seat) => ({
        ...seat,
        isBooked: bookedSeatIds.has(seat.id),
      })),
    };

    res.json(formattedShow);
  } catch (error) {
    console.error("Get show details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
