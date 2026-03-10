const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, universityEmail, password, university, faculty } = req.body;
  try {
    let user = await User.findOne({ universityEmail });
    if (user) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, universityEmail, password: hashedPassword, university, faculty });
    await user.save();

    res.status(201).json({ msg: 'User registered. Verify your email!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { universityEmail, password } = req.body;
  try {
    const user = await User.findOne({ universityEmail });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, university: user.university } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;