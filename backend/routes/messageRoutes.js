import express from "express";
import { sendBulkEmail } from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 🔥 SEND EMAIL WITH ATTACHMENTS
router.post(
  "/send",
  authMiddleware,
  upload.array("attachments"),
  sendBulkEmail
);

export default router;