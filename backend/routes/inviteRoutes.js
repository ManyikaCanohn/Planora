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

// PUBLIC INVITE PAGE
router.get("/:code", getInviteByCode);

// REGISTER PARTICIPANT
router.post("/register", registerToEvent);

// ADMIN PARTICIPANTS
router.get("/participants/:eventId", authMiddleware, getEventParticipants);

// APPROVE / REJECT
router.put("/approve/:id", authMiddleware, approveParticipant);
router.put("/reject/:id", authMiddleware, rejectParticipant);

export default router;