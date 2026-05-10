import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getShowDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const show = await prisma.show.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
            seats: {
              orderBy: [
                { row: "asc" },
                { number: "asc" },
              ],
            },
          },
        },
        bookings: {
          where: { status: "CONFIRMED" },
          include: {
            tickets: true,
          },
        },
      },
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
