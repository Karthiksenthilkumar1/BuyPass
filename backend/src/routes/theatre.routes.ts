import { Router } from "express";
import { createTheatre, getOwnerTheatres, createScreen, getTheatreScreens } from "../controllers/theatre.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Protected routes (requires authentication)
router.post("/", authenticate, createTheatre);
router.get("/owner", authenticate, getOwnerTheatres);

// Screen Management
router.post("/:id/screens", authenticate, createScreen);
router.get("/:id/screens", authenticate, getTheatreScreens);

export default router;
