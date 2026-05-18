import { Router } from "express";
import { createBooking, getUserBookings, getBookingById } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, createBooking);
router.get("/", authenticate, getUserBookings);
router.get("/:id", authenticate, getBookingById);

export default router;
