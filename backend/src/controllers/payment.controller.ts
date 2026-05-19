import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../lib/prisma";

export const processPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, cardNumber, cardHolder, expiryDate, cvv } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!bookingId || !cardNumber || !cardHolder || !expiryDate || !cvv) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Basic simulation validation
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      return res.status(400).json({ message: "Invalid card number (must be 16 digits)" });
    }
    if (cvv.length !== 3) {
      return res.status(400).json({ message: "Invalid CVV" });
    }

    // Fetch the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: Not your booking" });
    }

    if (booking.status === "CONFIRMED") {
      return res.status(400).json({ message: "Booking is already confirmed" });
    }

    // Simulate network delay of 1.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Force a specific payment decline for testing if card number ends in 0000
    if (cardNumber.endsWith("0000")) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "FAILED" },
      });
      return res.status(402).json({ message: "Payment Declined: Insufficient funds" });
    }

    // Confirm booking inside transaction
    const updatedBooking = await prisma.$transaction(async (tx) => {
      return await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          paymentIntentId: `sim_${Math.random().toString(36).substr(2, 9)}`,
        },
      });
    });

    res.json({ message: "Payment processed successfully", booking: updatedBooking });
  } catch (error) {
    console.error("Process payment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
