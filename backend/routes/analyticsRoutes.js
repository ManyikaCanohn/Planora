import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET ANALYTICS DATA
router.get("/", async (req, res) => {
  try {
    console.log("📊 Analytics route hit");

    const [totalEvents] = await db.query(
      "SELECT COUNT(*) as total FROM events"
    );

    const [activeEvents] = await db.query(
      "SELECT COUNT(*) as total FROM events WHERE end_date >= NOW()"
    );

    const [eventTypes] = await db.query(`
      SELECT event_type, COUNT(*) as count
      FROM events
      GROUP BY event_type
    `);

    const [attendance] = await db.query(`
        SELECT e.title, COUNT(a.id) as attendees
        FROM events e
        LEFT JOIN event_participants a ON e.id = a.event_id
        GROUP BY e.id
    `);

    const [eventsPerMonth] = await db.query(`
      SELECT MONTH(start_date) as month, COUNT(*) as count
      FROM events
      GROUP BY month
    `);

    console.log("✅ Analytics data fetched");

    res.json({
      totalEvents: totalEvents[0]?.total || 0,
      activeEvents: activeEvents[0]?.total || 0,
      eventTypes,
      attendance,
      eventsPerMonth
    });

  } catch (error) {
    console.error("❌ ANALYTICS ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;