const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true, // tokens should be unique
    },

    otp: {
      type: String,
      required: true,
      length: 6, // stored as string to preserve leading zeros
    },

    expires_at: {
      type: Date,
      required: true,
      index: true,
    },

    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Optional: auto-delete expired reset records
passwordResetSchema.index(
  { expires_at: 1 },
  { expireAfterSeconds: 0 }
);

const PasswordReset = mongoose.model(
  "PasswordReset",
  passwordResetSchema
);

module.exports = PasswordReset;
