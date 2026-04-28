import db from "../config/db.js";

// =========================
// GET EVENT BY INVITE CODE
// =========================
export const getInviteByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM events WHERE invite_code = ?",
      [code]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Invalid invite link" });
    }

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// REGISTER USER (PENDING)
// =========================
export const registerToEvent = async (req, res) => {
  try {
    const { event_id, name, email } = req.body;

    await db.execute(
      `INSERT INTO event_participants (event_id, name, email, status)
       VALUES (?, ?, ?, 'pending')`,
      [event_id, name, email]
    );

    res.json({ message: "Registration submitted for approval" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// GET PARTICIPANTS (ADMIN)
// =========================
export const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM event_participants WHERE event_id = ?",
      [eventId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// APPROVE USER
// =========================
export const approveParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      "UPDATE event_participants SET status='approved' WHERE id=?",
      [id]
    );

    res.json({ message: "User approved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// REJECT USER
// =========================
export const rejectParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      "UPDATE event_participants SET status='rejected' WHERE id=?",
      [id]
    );

    res.json({ message: "User rejected" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};