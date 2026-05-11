import db from "../config/db.js";

// =========================
// 📊 GET ANALYTICS (PER USER)
// =========================
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // =========================
    // 📌 TOTAL EVENTS
    // =========================
    const [totalEvents] = await db.execute(
      "SELECT COUNT(*) AS total FROM events WHERE created_by = ?",
      [userId]
    );

    // =========================
    // 📌 ACTIVE EVENTS
    // =========================
    const [activeEvents] = await db.execute(
      "SELECT COUNT(*) AS active FROM events WHERE created_by = ? AND status = 'active'",
      [userId]
    );

    // =========================
    // 📌 ATTENDANCE PER EVENT
    // =========================
    const [attendance] = await db.execute(
      `
      SELECT 
        e.id,
        e.title,
        COUNT(ep.id) AS attendees
      FROM events e
      LEFT JOIN event_participants ep 
        ON e.id = ep.event_id
      WHERE e.created_by = ?
      GROUP BY e.id
      ORDER BY attendees DESC
      `,
      [userId]
    );

    // =========================
    // 📌 EVENTS PER MONTH
    // =========================
    const [eventsPerMonth] = await db.execute(
      `
      SELECT 
        MONTH(created_at) AS month,
        COUNT(*) AS count
      FROM events
      WHERE created_by = ?
      GROUP BY MONTH(created_at)
      ORDER BY month ASC
      `,
      [userId]
    );

    // =========================
    // 📌 EVENT TYPES
    // =========================
    const [eventTypes] = await db.execute(
      `
      SELECT 
        event_type,
        COUNT(*) AS count
      FROM events
      WHERE created_by = ?
      GROUP BY event_type
      `,
      [userId]
    );

    // =========================
    // 📤 RESPONSE
    // =========================
    res.json({
      totalEvents: totalEvents[0].total,
      activeEvents: activeEvents[0].active,
      attendance,
      eventsPerMonth,
      eventTypes
    });

  } catch (err) {
    console.log("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};