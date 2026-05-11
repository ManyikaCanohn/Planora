import db from "../config/db.js";
import { sendStatusEmail } from "../utils/emailServices.js";

// GET ALL PARTICIPANTS
export const getParticipants = async (req, res) => { 
  try { 
    const userId = req.user.id;

    const [rows] = await db.query( 
      `
      SELECT ep.*, e.title AS event_name 
      FROM event_participants ep 
      JOIN events e ON ep.event_id = e.id 
      WHERE e.created_by = ?
      ORDER BY ep.created_at DESC
      `,
      [userId]
    ); 

    res.json(rows); 

  } catch (err) { 
    console.log("GET ERROR:", err); 
    res.status(500).json({ message: "Failed to fetch participants" });
  } 
};

// UPDATE STATUS + EMAIL NOTIFICATION
export const updateParticipantStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 1. Get participant + event info
    const [rows] = await db.query(`
      SELECT ep.*, e.title AS event_name
      FROM event_participants ep
      LEFT JOIN events e ON ep.event_id = e.id
      WHERE ep.id = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const participant = rows[0];

    // 2. Update DB
    await db.query(
      "UPDATE event_participants SET status = ? WHERE id = ?",
      [status, id]
    );

    // 3. Send email
    await sendStatusEmail(
      participant.email,
      participant.name,
      status,
      participant.event_name
    );

    res.json({
      message: "Status updated + email sent"
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};