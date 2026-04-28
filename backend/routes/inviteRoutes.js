import express from "express";
import {
  getInviteByCode,
  registerToEvent,
  getEventParticipants,
  approveParticipant,
  rejectParticipant
} from "../controllers/inviteController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC (invite link)
router.get("/:code", getInviteByCode);
router.post("/register", registerToEvent);

// ADMIN ONLY (protect these)
router.get("/participants/:eventId", authMiddleware, getEventParticipants);
router.put("/approve/:id", authMiddleware, approveParticipant);
router.put("/reject/:id", authMiddleware, rejectParticipant);

export default router;