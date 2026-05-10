import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Protected routes (Admin & Theatre Owner only)
router.post("/", authenticate, authorize(["ADMIN", "THEATRE_OWNER"]), createMovie);
router.put("/:id", authenticate, authorize(["ADMIN", "THEATRE_OWNER"]), updateMovie);
router.delete("/:id", authenticate, authorize(["ADMIN", "THEATRE_OWNER"]), deleteMovie);

export default router;
