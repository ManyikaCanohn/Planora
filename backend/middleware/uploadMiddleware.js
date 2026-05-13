import multer from "multer";
import path from "path";
import fs from "fs";


if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// =========================
// STORAGE CONFIG
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// =========================
// FILE FILTER
// =========================
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

// =========================
// MULTER INSTANCE
// =========================
export const upload = multer({
  storage,
  fileFilter,
});