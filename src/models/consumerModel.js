const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const consumerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    validate: [isEmail, "Please enter a valid email"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Please enter the username."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  role: {
    type: String,
    required: [true, "Please enter a role"],
    default: "consumer",
    enum: ["admin", "consumer"],
  },
});

// Hash password before saving
consumerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Custom login with multiple error handling
consumerSchema.statics.login = async function (email, password) {
  const errors = {};
  const consumer = await this.findOne({ email });
  if (!consumer) {
    errors.email = "Incorrect email";
  } else {
    const isMatch = await bcrypt.compare(password, consumer.password);
    if (!isMatch) {
      errors.password = "Incorrect password";
    }
  }

  if (Object.keys(errors).length > 0) {
    const err = new Error("Login failed");
    err.name = "ValidationError";
    err.errors = {};

    for (const key in errors) {
      err.errors[key] = {
        properties: {
          path: key,
          message: errors[key],
        },
      };
    }

    throw err;
  }

  return consumer;
};

module.exports = mongoose.model("Consumer", consumerSchema);
