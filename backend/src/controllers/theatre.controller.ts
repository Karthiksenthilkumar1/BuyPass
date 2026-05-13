import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../lib/prisma";

export const createTheatre = async (req: AuthRequest, res: Response) => {
  try {
    const { name, city, location } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== "THEATRE_OWNER") {
      return res.status(403).json({ message: "Forbidden: Only Theatre Owners can create theatres." });
    }

    if (!name || !city || !location) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const theatre = await prisma.theatre.create({
      data: {
        name,
        city,
        location,
        ownerId: userId,
      },
    });

    res.status(201).json({ message: "Theatre created successfully", theatre });
  } catch (error) {
    console.error("Error creating theatre:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOwnerTheatres = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || userRole !== "THEATRE_OWNER") {
      return res.status(403).json({ message: "Forbidden: Only Theatre Owners can view their theatres." });
    }

    const theatres = await prisma.theatre.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        _count: {
          select: { screens: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(theatres);
  } catch (error) {
    console.error("Error fetching owner theatres:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createScreen = async (req: AuthRequest, res: Response) => {
  try {
    const theatreId = req.params.id as string;
    const { name, format, layout } = req.body;
    const userId = req.user?.id;

    const theatre = await prisma.theatre.findUnique({ where: { id: theatreId } });
    if (!theatre || theatre.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this theatre." });
    }

    if (!name || !format || !layout || !Array.isArray(layout)) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const totalCapacity = layout.reduce((sum, row) => sum + row.seatsCount, 0);

    const screen = await prisma.$transaction(async (tx) => {
      const newScreen = await tx.screen.create({
        data: {
          name,
          format,
          theatreId,
          totalCapacity,
        },
      });

      const seatData = [];
      for (const row of layout) {
        for (let i = 1; i <= row.seatsCount; i++) {
          seatData.push({
            screenId: newScreen.id,
            row: row.rowLabel,
            number: i,
            category: row.category,
            priceMultiplier: Number(row.priceMultiplier),
          });
        }
      }

      if (seatData.length > 0) {
        await tx.seat.createMany({
          data: seatData,
        });
      }

      return newScreen;
    });

    res.status(201).json({ message: "Screen created successfully", screen });
  } catch (error) {
    console.error("Error creating screen:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTheatreScreens = async (req: AuthRequest, res: Response) => {
  try {
    const theatreId = req.params.id as string;
    const userId = req.user?.id;

    const theatre = await prisma.theatre.findUnique({ where: { id: theatreId } });
    if (!theatre || theatre.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this theatre." });
    }

    const screens = await prisma.screen.findMany({
      where: { theatreId },
      include: {
        _count: {
          select: { seats: true, shows: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json(screens);
  } catch (error) {
    console.error("Error fetching screens:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
