import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    console.log("COOKIES:", req.cookies);

    // 🛡 SAFE ACCESS (prevents crash)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated - no token"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
