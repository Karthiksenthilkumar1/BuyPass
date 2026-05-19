import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user?.id;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: "Invalid booking request" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. Fetch show and selected seats
    const show = await prisma.show.findUnique({
      where: { id: showId },
      include: { screen: { include: { seats: true } } },
    });

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const selectedSeats = show.screen.seats.filter((s) => seatIds.includes(s.id));

    if (selectedSeats.length !== seatIds.length) {
      return res.status(400).json({ message: "One or more selected seats are invalid for this screen" });
    }

    // 2. Create booking in a transaction with availability check
    const booking = await prisma.$transaction(async (tx) => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const existingBookings = await tx.ticket.findMany({
        where: {
          seatId: { in: seatIds },
          booking: {
            showId: showId,
            OR: [
              { status: "CONFIRMED" },
              {
                status: "PENDING",
                createdAt: { gte: tenMinutesAgo }
              }
            ]
          },
        },
      });

      if (existingBookings.length > 0) {
        throw new Error("SEATS_ALREADY_BOOKED");
      }

      // 3. Calculate total amount
      let totalAmount = 0;
      selectedSeats.forEach((seat) => {
        totalAmount += show.basePrice * seat.priceMultiplier;
      });

      const platformFee = 20; // Fixed fee per booking
      const taxes = totalAmount * 0.18; // 18% GST
      const finalAmount = totalAmount + platformFee + taxes;

      // 4. Create booking and tickets
      const newBooking = await tx.booking.create({
        data: {
          userId,
          showId,
          totalAmount: finalAmount,
          platformFee,
          taxes,
          status: "PENDING",
          tickets: {
            create: seatIds.map((seatId: string) => ({
              seatId,
            })),
          },
        },
        include: {
          tickets: true,
          show: { include: { movie: true } },
        },
      });

      return newBooking;
    });

    res.status(201).json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    if (error instanceof Error && error.message === "SEATS_ALREADY_BOOKED") {
      return res.status(400).json({ message: "One or more seats are already booked" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theatre: true,
              },
            },
          },
        },
        tickets: {
          include: {
            seat: true,
          }
        },
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theatre: true,
              },
            },
          },
        },
        tickets: {
          include: {
            seat: true,
          }
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: Not your booking" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
