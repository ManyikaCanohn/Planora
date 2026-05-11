import nodemailer from "nodemailer";

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
  message
) => {
  try {
    let finalSubject = subject;
    let finalMessage = message;

    if (type === "approved") {
      finalSubject = "🎉 Approval Update";
      finalMessage = `Hello ${name},\n\nYou have been APPROVED.\n`;
    }

    if (type === "rejected") {
      finalSubject = "❌ Rejection Update";
      finalMessage = `Hello ${name},\n\nYour registration was rejected.\n`;
    }

    if (type === "bulk") {
      finalSubject = subject;
      finalMessage = `Hello ${name},\n\n${message}`;
    }

    await transporter.sendMail({
      from: `"Planora Events" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: finalSubject,
      text: finalMessage,
    });

    console.log("📧 Email sent to:", email);
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    throw err; // 🔥 important so controller can catch it
  }
};