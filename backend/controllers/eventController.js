import db from "../config/db.js";
import crypto from "crypto";

const generateCode = () => {
  return crypto.randomBytes(4).toString("hex");
};

export const createEvent = async (req, res) => {
  try {
    console.log("USER FROM JWT:", req.user);

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const data = req.body;
    const inviteCode = generateCode();

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
      Number(req.user.id),
      inviteCode
    ]);

    res.status(201).json({
      message: "Event created",
      inviteLink: `http://localhost:5173/invite/${inviteCode}`
    });

  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await db.execute("DELETE FROM events WHERE id=?", [req.params.id]);

    res.json({ message: "Event deleted" });

  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const sql = `
      UPDATE events SET
      title=?, description=?, event_type=?, status=?,
      location_name=?, latitude=?, longitude=?, event_link=?,
      start_date=?, end_date=?
      WHERE id=?
    `;

    await db.execute(sql, [
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
      id
    ]);

    res.json({ message: "Event updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const [eventRows] = await db.execute(
      "SELECT * FROM events WHERE id = ?",
      [id]
    );

    if (!eventRows.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventRows[0];

    const [participants] = await db.execute(
      "SELECT * FROM event_participants WHERE event_id = ?",
      [id]
    );

    res.json({
      ...event,
      attendees: participants
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};