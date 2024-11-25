const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, "tcmTM");
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// SIGN IN API
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username should have at least 4 characters" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPass }); // Use password, not hashPass
    await newUser.save();

    return res.status(200).json({
      message: "Sign-up successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN API
router.post("/log-in", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username: username });
  if (!existingUser) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  // Use async/await for bcrypt.compare
  const match = await bcrypt.compare(password, existingUser.password);
  if (match) {
    const authClaims = [{ name: username }, { jti: jwt.sign({}, "tcmTM") }];
    const token = jwt.sign({ authClaims }, "tcmTM", { expiresIn: "2d" });
    return res.status(200).json({ id: existingUser._id, token: token });
  } else {
    return res.status(400).json({ message: "Invalid Credentials" });
  }
});

// VERIFY EMAIL API
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const { username, email, password } = verifyToken(token); // Use verifyToken function

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(200).json({
      message: "Email verified successfully! Your account has been created.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;