import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import db from "../config/db.js"; // ensure db.js uses ESM
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// ===========================
// FORGOT PASSWORD
// ===========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent." });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Save token & expiry in DB
    await user.update({ reset_token: token, reset_token_expires: expires });

    // Send email
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendEmail(
      user.email,
      "Reset Your Password",
      `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    );

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending email" });
  }
});

// ===========================
// RESET PASSWORD
// ===========================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Invalid request" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await db.query(
      "SELECT id, reset_token_expires FROM users WHERE reset_token = ? LIMIT 1",
      [hashedToken]
    );

    if (!rows || rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const user = rows[0];

    if (new Date(user.reset_token_expires) < new Date())
      return res.status(400).json({ message: "Token expired" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password & clear token
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

export default router;
