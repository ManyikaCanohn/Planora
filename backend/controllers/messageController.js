import db from "../config/db.js";
import fs from "fs";

import { sendStatusEmail } from "../utils/emailServices.js";

// =========================
// SEND BULK EMAIL
// =========================
export const sendBulkEmail = async (req, res) => {
  const { event_id, subject, message, status } =
    req.body;

  // 🔥 uploaded files
  const files = req.files || [];

  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  try {
    let query = `
      SELECT ep.name, ep.email
      FROM event_participants ep
      JOIN events e ON ep.event_id = e.id
      WHERE ep.event_id = ?
      AND e.created_by = ?
    `;

    const params = [event_id, userId];

    // =========================
    // FILTER STATUS
    // =========================
    if (status && status !== "all") {
      query += " AND ep.status = ?";
      params.push(status);
    }

    const [users] = await db.query(query, params);

    if (!users.length) {
      return res.status(404).json({
        message: "No attendees found",
      });
    }

    // =========================
    // SEND EMAILS
    // =========================
    await Promise.all(
      users.map((user) =>
        sendStatusEmail(
          user.email,
          user.name,
          "bulk",
          subject,
          message,
          files
        )
      )
    );


    res.json({
      message: `Emails sent to ${users.length} attendees`,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to send emails",
    });
  }
};