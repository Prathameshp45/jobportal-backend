const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user' // Default role is 'user' if not provided
    });

    await newUser.save();

    // Generate JWT token
    const payload = { userId: newUser._id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, msg: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /register:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

    res.json({ token, msg: 'Login successful' });
  } catch (error) {
    console.error('Error in /login:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/getUserInfo', auth,async (req, res) => {
    console.log('user',req.user)
    const userId = req.user.userId

    try {
        const user = await User.findById(userId);

        return res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ msg: error});

    }
});

//getuserbyid

router.get('/getUserById/:id', auth, async (req, res) => {
    console.log('user',req.user)
    const userId = req.params.id

    try {
        const user = await User.findById(userId);

        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).json(error);

    }
});

router.get('/getAllUsers', auth,async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).send(users);
} catch (error) {
    return res.status(500).json(error);

}
})


module.exports = router;
