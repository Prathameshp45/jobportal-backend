const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path to User model

// Register new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
      role: role || 'user', // Default to "user" role if none provided
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save user to database
    await newUser.save();

    return res.status(201).json({
      msg: 'User registered successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid email or password' });
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid email or password' });
      }
  
      // Generate a token
      const token = jwt.sign(
        { userId: user._id, role: user.role }, // Include role in the token payload
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Respond with the token and user details
      return res.json({
        msg: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  };
  
  