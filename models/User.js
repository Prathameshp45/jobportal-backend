const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // Removes extra spaces
    // maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    // lowercase: true, // Ensures email is stored in lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Email validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    // minlength: [6, 'Password must be at least 6 characters long'], // Password length validation
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Limits roles to specific values
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true }); // Adds `createdAt` and `updatedAt` timestamps automatically

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
