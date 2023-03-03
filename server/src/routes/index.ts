import { Router } from "express";
import UserRoutes from "./user";
import EventRoutes from "./event";

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/event", EventRoutes);

export default router;
