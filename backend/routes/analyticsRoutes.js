import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 protected route (user-specific analytics)
router.get("/", authMiddleware, getAnalytics);

export default router;