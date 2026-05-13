import nodemailer from "nodemailer";
import sanitizeHtml from "sanitize-html";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendStatusEmail = async (
  email,
  name,
  type,
  subject,
  message,
  files = []
) => {
  try {
    let finalSubject = subject;
    let finalMessage = message;
    
    files.forEach((file, index) => {
      finalMessage = finalMessage.replace(
        /blob:http[^"]+/,
        `cid:image${index}`
      );
    });

    // =========================
    // APPROVED EMAIL
    // =========================
    if (type === "approved") {
      finalSubject = "🎉 Approval Update";

      finalMessage = `
        <h2>Hello ${name}</h2>
        <p>You have been APPROVED.</p>
      `;
    }

    // =========================
    // REJECTED EMAIL
    // =========================
    if (type === "rejected") {
      finalSubject = "❌ Rejection Update";

      finalMessage = `
        <h2>Hello ${name}</h2>
        <p>Your registration was rejected.</p>
      `;
    }

    // =========================
    // BULK EMAIL
    // =========================
    if (type === "bulk") {
      finalSubject = subject;

      finalMessage = `
        <div style="font-family:sans-serif;padding:20px;">
          <h2>Hello ${name},</h2>

          <div>
            ${message}
          </div>

          <br/>

          <p style="color:gray;font-size:13px;">
            Sent via Planora.
          </p>
        </div>
      `;
    }

    // =========================
    // SANITIZE HTML
    // =========================
    const cleanHTML = sanitizeHtml(finalMessage, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
      ]),

      allowedAttributes: {
        a: ["href", "target"],
        img: ["src", "style"],
        "*": ["style"],
      },
    });

    // =========================
    // SEND EMAIL
    // =========================
    await transporter.sendMail({
      from: `"Planora Events" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: finalSubject,

      // 🔥 HTML SUPPORT
      html: cleanHTML,

      // 🔥 ATTACHMENTS
      attachments: files.map((file, index) => ({
        filename: file.originalname,

        content: fs.readFileSync(file.path),

        cid: `images${index}`,
      }))
    });

    console.log("📧 Email sent to:", email);

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    throw err;
  }
};