import express from "express";
import { register, login } from "../controllers/authController.js";
import { getParticipants } from "../controllers/participantController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMe, getEventStats } from "../controllers/authController.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/stats", authMiddleware, getEventStats);
router.get("/participants", getParticipants);


router.get("/me", authMiddleware, getMe);



export default router;