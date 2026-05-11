import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { getInviteByCode } from "../controllers/inviteController.js";
import { getEventById } from "../controllers/eventController.js"; 
import { getEventStats } from "../controllers/eventController.js";


const router = express.Router();

// 🔐 PROTECT ALL EVENT ROUTES
router.use(authMiddleware);

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/stats", authMiddleware, getEventStats);

router.get("/invite/:code", getInviteByCode); // 🔥 FIXED

router.get("/:id", getEventById); // 🔥 SAFE NOW

router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);


export default router;