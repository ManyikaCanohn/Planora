// Import database
import db from "../config/db.js";


// =======================
// REGISTER FOR EVENT
// =======================
export const registerForEvent = (req, res) => {

  const user_id = req.user.id; // logged-in user
  const { event_id } = req.body;

  // Step 1: check duplicate registration
  const checkSql = `
    SELECT * FROM registrations 
    WHERE user_id = ? AND event_id = ?
  `;

  db.query(checkSql, [user_id, event_id], (err, results) => {

    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Step 2: check event capacity
    const capacitySql = `
      SELECT capacity,
      (SELECT COUNT(*) FROM registrations WHERE event_id = ?) AS total
      FROM events
      WHERE id = ?
    `;

    db.query(capacitySql, [event_id, event_id], (err, data) => {

      if (err) return res.status(500).json(err);

      if (data.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      const { capacity, total } = data[0];

      if (total >= capacity) {
        return res.status(400).json({ message: "Event is full" });
      }

      // Step 3: insert registration
      const insertSql = `
        INSERT INTO registrations (user_id, event_id)
        VALUES (?, ?)
      `;

      db.query(insertSql, [user_id, event_id], (err) => {

        if (err) return res.status(500).json(err);

        res.status(201).json({ message: "Registered successfully" });
      });
    });
  });
};


// =======================
// GET MY REGISTRATIONS
// =======================
export const getMyRegistrations = (req, res) => {

  const user_id = req.user.id;

  const sql = `
    SELECT r.id, e.title, e.date_time, e.location
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {

    if (err) return res.status(500).json(err);

    res.json(results);
  });
};


// =======================
// CANCEL REGISTRATION
// =======================
export const cancelRegistration = (req, res) => {

  const user_id = req.user.id;
  const { event_id } = req.params;

  const sql = `
    DELETE FROM registrations 
    WHERE user_id = ? AND event_id = ?
  `;

  db.query(sql, [user_id, event_id], (err) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "Registration cancelled" });
  });
};