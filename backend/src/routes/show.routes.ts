import { Router } from "express";
import { getShowDetails, createShow } from "../controllers/show.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:id", getShowDetails);
router.post("/", authenticate, createShow);

export default router;
