import { Router } from "express";
import { createEvent } from "../controllers/event";

const router = Router();

router.post("/create", createEvent);

export default router;
