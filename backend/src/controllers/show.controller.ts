import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
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

export const createShow = async (req: AuthRequest, res: Response) => {
  console.log("createShow called with body:", req.body);
  try {
    const { movieId, screenId, startTime, basePrice } = req.body;
    const userId = req.user?.id;

    if (!movieId || !screenId || !startTime || basePrice === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const screen = await prisma.screen.findUnique({
      where: { id: screenId },
      include: { theatre: true },
    });

    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    if (screen.theatre.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this theatre." });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const newStartTime = new Date(startTime);
    // Buffer of 3 hours before and after to check for conflicts
    const threeHoursBefore = new Date(newStartTime.getTime() - 3 * 60 * 60 * 1000);
    const threeHoursAfter = new Date(newStartTime.getTime() + 3 * 60 * 60 * 1000);

    const conflictingShow = await prisma.show.findFirst({
      where: {
        screenId,
        startTime: {
          gte: threeHoursBefore,
          lte: threeHoursAfter,
        },
      },
    });

    if (conflictingShow) {
      return res.status(409).json({ message: "Scheduling conflict: Another show is scheduled on this screen within 3 hours." });
    }

    const show = await prisma.show.create({
      data: {
        movieId,
        screenId,
        startTime: newStartTime,
        basePrice: parseFloat(basePrice),
      },
      include: {
        movie: true,
        screen: true,
      },
    });

    res.status(201).json({ message: "Show created successfully", show });
  } catch (error) {
    console.error("Create show error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
};
