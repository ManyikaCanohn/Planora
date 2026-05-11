import express from "express";
import {
  getParticipants,
  updateParticipantStatus
} from "../controllers/participantController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getParticipants);
router.put("/:id", authMiddleware, updateParticipantStatus);

export default router;