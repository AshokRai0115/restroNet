const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendMail } = require("../middlewares/emailService");

const {
  saveReset,
  findReset,
  markResetUsed,
  findUserByEmail,
  updatePassword,
} = require("../services/passwordResetService");

// generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// generate secure token
const generateToken = () =>
  crypto.randomBytes(32).toString("hex");

// -----------------------------
// REQUEST PASSWORD RESET
// -----------------------------
exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email required" });

    const user = await findUserByEmail(email);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = generateToken();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await saveReset({
      email,
      token,
      otp,
      expires_at: expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Use OTP: <b>${otp}</b></p>
        <p>Expires in 10 minutes</p>
      `,
    });

    res.json({ message: "Reset email sent ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

// -----------------------------
// RESET PASSWORD
// -----------------------------
exports.resetPassword = async (req, res) => {
  try {
    const { token, otp, newPassword } = req.body;

    if (!token || !otp || !newPassword)
      return res.status(400).json({
        message: "Token, OTP and new password are required",
      });

    const record = await findReset(token);

    if (!record)
      return res.status(400).json({
        message: "Invalid or expired token",
      });

    if (record.otp !== otp)
      return res.status(400).json({
        message: "Invalid OTP",
      });

    const user = await findUserByEmail(record.email);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updatePassword(user._id, hashedPassword);
    await markResetUsed(record._id);

    res.json({ message: "Password successfully reset ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Password reset failed" });
  }
};
