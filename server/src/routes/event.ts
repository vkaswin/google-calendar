import { Router } from "express";
import {
  createEvent,
  getEventByDate,
  updateEvent,
  deleteEvent,
  searchEvents,
} from "../controllers/event";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/date", getEventByDate);
router.get("/search", searchEvents);

router.post("/create", createEvent);

router.put("/:id/edit", updateEvent);

router.delete("/:id/remove", deleteEvent);

export default router;
