const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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
    default: "user",
    enum: ["admin", "user"],
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Custom login with multiple error handling
userSchema.statics.login = async function (email, password) {
  const errors = {};
  const user = await this.findOne({ email });

  if (!user) {
    errors.email = "Incorrect email";
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
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

  return user;
};

module.exports = mongoose.model("User", userSchema);
