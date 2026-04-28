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
      message: "Login successful",
      user
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

    const [rows] = await db.execute(
      "SELECT * FROM event_registrations WHERE event_id = ?",
      [eventId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateParticipantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.execute(
      "UPDATE event_registrations SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "Status updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
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

