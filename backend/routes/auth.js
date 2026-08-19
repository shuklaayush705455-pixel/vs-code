const express = require("express");
const router = express.Router();
const User = require("../models/User");

// signup
router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "User not found" });

  if (user.password !== password)
    return res.status(400).json({ msg: "Wrong password" });

  res.json(user);
});

module.exports = router;