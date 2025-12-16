const PasswordReset = require("../models/resetPasswordModel");
const Consumer = require("../models/consumerModel");

// -----------------------------
// Save reset record
// -----------------------------
exports.saveReset = (data) => {
  return PasswordReset.create(data);
};

// -----------------------------
// Find a reset record by token (not used & not expired)
// -----------------------------
exports.findReset = (token) => {
  return PasswordReset.findOne({
    token,
    used: false,
    expires_at: { $gt: new Date() },
  });
};

// -----------------------------
// Mark reset as used
// -----------------------------
exports.markResetUsed = (id) => {
  return PasswordReset.findByIdAndUpdate(id, { used: true });
};

// -----------------------------
// Find user by email
// -----------------------------
exports.findUserByEmail = (email) => {
  return Consumer.findOne({ email });
};

// -----------------------------
// Update password
// -----------------------------
exports.updatePassword = (userId, hashedPassword) => {
  return Consumer.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });
};

// -----------------------------
// Optional cleanup (not required if TTL index is used)
// -----------------------------
exports.deleteExpiredResets = () => {
  return PasswordReset.deleteMany({
    expires_at: { $lt: new Date() },
  });
};
