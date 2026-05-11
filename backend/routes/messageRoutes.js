import express from "express";
import { sendBulkEmail } from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 bulk email
router.post("/send", authMiddleware, sendBulkEmail);

export default router;