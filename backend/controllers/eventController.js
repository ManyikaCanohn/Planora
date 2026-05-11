import db from "../config/db.js";
import crypto from "crypto";

const generateCode = () => crypto.randomBytes(4).toString("hex");

export const createEvent = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const data = req.body;
    const inviteCode = generateCode();
    const userId = req.user.id;

    const sql = `
      INSERT INTO events 
      (title, description, event_type, status, location_name, latitude, longitude, start_date, end_date, created_by, invite_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      data.title || null,
      data.description || null,
      data.event_type || "virtual",
      data.status || "draft",
      data.location_name || null,
      data.latitude || null,
      data.longitude || null,
      data.start_date || null,
      data.end_date || null,
      userId,
      inviteCode
    ]);

    res.status(201).json({
      message: "Event created",
      inviteLink: `http://localhost:5173/invite/${inviteCode}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await db.execute(
      "DELETE FROM events WHERE id=? AND created_by=?",
      [req.params.id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not allowed or event not found" });
    }

    res.json({ message: "Event deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT * FROM events WHERE created_by = ?",
      [userId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user.id;

    const sql = `
      UPDATE events SET
      title=?, description=?, event_type=?, status=?,
      location_name=?, latitude=?, longitude=?, event_link=?,
      start_date=?, end_date=?
      WHERE id=? AND created_by=?
    `;

    const [result] = await db.execute(sql, [
      data.title,
      data.description,
      data.event_type,
      data.status,
      data.location_name,
      data.latitude,
      data.longitude,
      data.event_link,
      data.start_date,
      data.end_date,
      id,
      userId
    ]);

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ message: "Event updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [eventRows] = await db.execute(
      "SELECT * FROM events WHERE id = ? AND created_by = ?",
      [id, userId]
    );

    if (!eventRows.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    const [participants] = await db.execute(
      `SELECT * FROM event_participants 
       WHERE event_id = ?`,
      [id]
    );

    res.json({
      ...eventRows[0],
      attendees: participants
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total events
    const [events] = await db.execute(
      "SELECT COUNT(*) AS totalEvents FROM events WHERE created_by = ?",
      [userId]
    );

    // Total participants
    const [participants] = await db.execute(
      `
      SELECT COUNT(*) AS totalParticipants
      FROM event_participants ep
      JOIN events e ON ep.event_id = e.id
      WHERE e.created_by = ?
      `,
      [userId]
    );

    // Upcoming events
    const [upcoming] = await db.execute(
      `
      SELECT COUNT(*) AS upcomingEvents
      FROM events
      WHERE created_by = ? AND start_date > NOW()
      `,
      [userId]
    );

    res.json({
      totalEvents: events[0].totalEvents,
      totalParticipants: participants[0].totalParticipants,
      upcomingEvents: upcoming[0].upcomingEvents,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};