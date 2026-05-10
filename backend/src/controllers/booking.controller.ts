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

    // 2. Check availability in a transaction-like way (Simplified for now)
    const existingBookings = await prisma.ticket.findMany({
      where: {
        seatId: { in: seatIds },
        booking: {
          showId: showId,
          status: "CONFIRMED",
        },
      },
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "One or more seats are already booked" });
    }

    // 3. Calculate total amount
    let totalAmount = 0;
    selectedSeats.forEach((seat) => {
      totalAmount += show.basePrice * seat.priceMultiplier;
    });

    const platformFee = 20; // Fixed fee per booking
    const taxes = totalAmount * 0.18; // 18% GST
    const finalAmount = totalAmount + platformFee + taxes;

    // 4. Create booking and tickets in transaction
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId,
          showId,
          totalAmount: finalAmount,
          platformFee,
          taxes,
          status: "CONFIRMED", // Assume instant confirmation for now
          tickets: {
            create: seatIds.map((seatId) => ({
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
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
