import { Router } from "express";
import { createBooking } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, createBooking);

export default router;
