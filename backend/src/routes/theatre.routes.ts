import { Router } from "express";
import { createTheatre, getOwnerTheatres } from "../controllers/theatre.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Protected routes (requires authentication)
router.post("/", authenticate, createTheatre);
router.get("/owner", authenticate, getOwnerTheatres);

export default router;
