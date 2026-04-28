import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// 🔥 TEST CONNECTION (VERY IMPORTANT)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Planora MySQL Connected ✅✅✅ ");
    connection.release();
  } catch (err) {
    console.error("MySQL Connection Failed: ❌❌❌", err.message);
  }
})();

export default db;