import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";


const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );

    res.json({ message: "User created" });

  } catch (err) {
    res.status(500).json(err);
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];
    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 CHECK PASSWORD
    const match = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH 🔥🔥🔥:", match);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 CREATE TOKEN
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("TOKEN CREATED:", token);

    // 🔥 SET COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    console.log("COOKIE SET ✅");

    // 🔥 RESPONSE
    res.json({
  message: "✅✅✅ Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });

    console.log("LOGIN RESPONSE SENT ✅");

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createInvite = async (req, res) => {
  try {
    const { event_id } = req.body;

    const code = crypto.randomBytes(6).toString("hex");

    await db.execute(
      "INSERT INTO event_invites (event_id, invite_code) VALUES (?, ?)",
      [event_id, code]
    );

    res.json({
      message: "Invite created",
      link: `http://localhost:5173/invite/${code}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getInvite = async (req, res) => {
  try {
    const { code } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM event_invites WHERE invite_code = ?",
      [code]
    );

    const invite = rows[0];

    if (!invite) {
      return res.status(404).json({ message: "Invalid invite" });
    }

    res.json(invite);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const registerToEvent = async (req, res) => {
  try {
    const { event_id, name, email } = req.body;

    await db.execute(
      `INSERT INTO event_registrations (event_id, name, email)
       VALUES (?, ?, ?)`,
      [event_id, name, email]
    );

    res.json({ message: "Registration submitted (pending approval)" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT er.*
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.event_id = ? AND e.created_by = ?
      `,
      [eventId, userId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS + EMAIL NOTIFICATION 
export const updateParticipantStatus = async (req, res) => { 
  const { id } = req.params; 
  const { status } = req.body; 
  try { 
     // 1. Get participant + event info 
     const [rows] = await db.query(
        `
        SELECT ep.*, e.title AS event_name
        FROM event_participants ep
        LEFT JOIN events e ON ep.event_id = e.id
        WHERE ep.id = ?
        `,
        [id]
      );

      if (!rows.length) 
        { return res.status(404).json({ message: "Participant not found" }); 
      } 

      const participant = rows[0];  

     // Update DB 
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
      }); } catch (err) { 
        console.error("UPDATE ERROR:", err); 
        res.status(500).json({ message: "Failed to update status" });
       } 
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only"
    });
  }

  next();
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: rows[0],
    });

  } catch (error) {
    console.error("GET ME ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // =========================
    // TOTAL EVENTS (per user)
    // =========================
    const [events] = await db.execute(
      "SELECT COUNT(*) AS total FROM events WHERE created_by = ?",
      [userId]
    );

    // =========================
    // ACTIVE EVENTS (per user)
    // =========================
    const [active] = await db.execute(
      "SELECT COUNT(*) AS active FROM events WHERE created_by = ? AND status = 'active'",
      [userId]
    );

    // =========================
    // ATTENDANCE PER EVENT (per user)
    // =========================
    const [attendance] = await db.execute(
      `
      SELECT e.title, COUNT(ep.id) AS attendees
      FROM events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      WHERE e.created_by = ?
      GROUP BY e.id
      `,
      [userId]
    );

    // =========================
    // EVENTS PER MONTH (per user)
    // =========================
    const [eventsPerMonth] = await db.execute(
      `
      SELECT MONTH(created_at) AS month, COUNT(*) AS count
      FROM events
      WHERE created_by = ?
      GROUP BY MONTH(created_at)
      ORDER BY month
      `,
      [userId]
    );

    // =========================
    // EVENT TYPES (per user)
    // =========================
    const [eventTypes] = await db.execute(
      `
      SELECT event_type, COUNT(*) AS count
      FROM events
      WHERE created_by = ?
      GROUP BY event_type
      `,
      [userId]
    );

    res.json({
      totalEvents: events[0].total,
      activeEvents: active[0].active,
      attendance,
      eventsPerMonth,
      eventTypes
    });

  } catch (err) {
    console.log("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

export const getEventStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // ======================
    // TOTAL EVENTS
    // ======================
    const [total] = await db.execute(
      "SELECT COUNT(*) AS total FROM events WHERE created_by = ?",
      [userId]
    );

    // ======================
    // ACTIVE EVENTS
    // ======================
    const [active] = await db.execute(
      "SELECT COUNT(*) AS active FROM events WHERE created_by = ? AND status = 'active'",
      [userId]
    );

    // ======================
    // ATTENDANCE PER EVENT
    // ======================
    const [attendance] = await db.execute(
      `
      SELECT e.title, COUNT(ep.id) AS attendees
      FROM events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      WHERE e.created_by = ?
      GROUP BY e.id
      ORDER BY attendees DESC
      `,
      [userId]
    );

    // ======================
    // EVENTS PER MONTH
    // ======================
    const [eventsPerMonth] = await db.execute(
      `
      SELECT MONTH(created_at) AS month, COUNT(*) AS count
      FROM events
      WHERE created_by = ?
      GROUP BY MONTH(created_at)
      ORDER BY month
      `,
      [userId]
    );

    res.json({
      totalEvents: total[0].total,
      activeEvents: active[0].active,
      attendance,
      eventsPerMonth
    });

  } catch (err) {
    console.log("STATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};