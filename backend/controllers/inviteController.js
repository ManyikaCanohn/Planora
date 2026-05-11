import db from "../config/db.js";

/* =====================================================
   GET EVENT BY INVITE CODE
===================================================== */
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

    return res.json(rows[0]);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   REGISTER TO EVENT (INVITE SYSTEM)
===================================================== */
export const registerToEvent = async (req, res) => {
  try {
    const { event_id, name, email } = req.body;

    await db.execute(
      `INSERT INTO event_participants (event_id, name, email)
       VALUES (?, ?, ?)`,
      [event_id, name, email]
    );

    res.json({ message: "Registration submitted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   GET PARTICIPANTS (ADMIN)
===================================================== */
export const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 🔥 SAFE user id handling (fixes silent failures)
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const sql = `
      SELECT 
        ep.id,
        ep.event_id,
        ep.name,
        ep.email,
        ep.status,
        ep.created_at
      FROM event_participants ep
      INNER JOIN events e ON ep.event_id = e.id
      WHERE ep.event_id = ?
      AND e.created_by = ?
    `;

    const [rows] = await db.execute(sql, [eventId, userId]);

    res.json(rows);

  } catch (err) {
    console.error("GET EVENT PARTICIPANTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   APPROVE PARTICIPANT
===================================================== */
export const approveParticipant = async (req, res) => {
  try {
    await db.execute(
      "UPDATE event_participants SET status='approved' WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "User approved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   REJECT PARTICIPANT
===================================================== */
export const rejectParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      "UPDATE event_participants SET status='rejected' WHERE id=?",
      [id]
    );

    return res.json({ message: "User rejected" });

  } catch (err) {
    console.error("REJECT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};