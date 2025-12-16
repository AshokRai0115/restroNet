const Consumer = require("../models/consumerModel");
const jwt = require("jsonwebtoken");
const handleError = require("../utils/handleError");

const maxAge = 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "token id", { expiresIn: maxAge });
};

// @desc    Login user
module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Consumer.login(email, password);
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      success:true,
      message: "Successfully logged in.",
      user,
      token,
    });
  } catch (error) {
    // const errors = handleError(error);
    // res.status(400).json({ errors });
    next(error)
  }
};

module.exports.signUp = async (req, res, next) => {
  const { email, password, username, role } = req.body;
  const newConsumer = new Consumer({ email, password, username, role });

  const errorBag = {
    email: '',
    password: '',
    username: ''
  };

  try {
    // Validate schema fields (required, minlength, format)
    await newConsumer.validate();
  } catch (err) {
    Object.values(err.errors).forEach((errObj) => {
      const { path, message } = errObj.properties;
      if (errorBag.hasOwnProperty(path)) {
        errorBag[path] = message;
      }
    });
  }

  // Check for duplicates manually
  const [existingEmail, existingUsername] = await Promise.all([
    Consumer.findOne({ email }),
    Consumer.findOne({ username }),
  ]);

  if (existingEmail) errorBag.email = "Email already in use.";
  if (existingUsername) errorBag.username = "Username already taken.";

  // If any errors, return
  if (errorBag.email || errorBag.password || errorBag.username) {
    return res.status(400).json({ errors: errorBag, success: false });
  }

  try {
    // If all good, save
    await newConsumer.save();
    res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
      newConsumer,
    });
  } catch (error) {
   next(error)
  }
};


// @desc    Get all users
module.exports.allUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      message: "Successfully retrieved all users.",
      count: users.length,
      users,
    });
  } catch (error) {
    const errors = handleError(error);
    res.status(500).json({ errors });
  }
};
