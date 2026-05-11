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
