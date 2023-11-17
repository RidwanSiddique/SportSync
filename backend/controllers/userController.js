const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");


const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN, { expiresIn: "3d" });
};
// user login handling
// Handles user login logics
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // validation
  if (!email && !password) {
    return res.status(404).json({
      success: false,
      message: "All Fields must be filled!",
    });
  }
  // empty password field
  if (!password) {
    return res.status(404).json({
      success: false,
      message: "Must enter a password!",
    });
  }
  // empty email field
  if (!email) {
    return res.status(404).json({
      success: false,
      message: "Must enter an email!",
    });
  }
  try {
    // check if entered email exists in the database.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist!",
      });
    }
    // Match the user input password with the hashed password from the database
    // bcrypt.compare will hash out the encrypted password from the database and match it with the user input in password section
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid username or password!",
      });
    }

    const token = createToken(user._id);
    res.status(200).json({
      userId: user._id,
      email,
      token,
      success: true,
      message: "passed",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// User registration handling
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // validation
  // empty email and password field
  if (!email && !password) {
    return res.status(404).json({
      success: false,
      message: "All Fields must be filled!",
    });
  }
  // empty password field
  if (!password) {
    return res.status(404).json({
      success: false,
      message: "Must enter a password!",
    });
  }
  // empty email field
  if (!email) {
    return res.status(404).json({
      success: false,
      message: "Must enter an email!",
    });
  }
  // check if email is valid
  if (!validator.isEmail(email)) {
    throw Error("email is not valid");
  }
  // check if new registration email already exists in the database.
  const exists = await User.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  // hash password so the password entered by the user will be saved encrypted in the database for better security
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
    });
    // create a token
    const token = createToken(user._id);
    res.status(200).json({
      userId: user._id,
      email,
      token,
      success: true,
      message: "passed",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        // Add other user properties here
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


module.exports = {
  loginUser,
  registerUser,
  userProfile,
};
