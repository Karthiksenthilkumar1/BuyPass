import { Router } from "express";
import { getShowDetails } from "../controllers/show.controller";

const router = Router();

router.get("/:id", getShowDetails);

export default router;
