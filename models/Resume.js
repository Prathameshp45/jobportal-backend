const mongoose = require('mongoose');

// Define the schema for Resume
const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Assuming the 'User' model is defined elsewhere
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true,
  },
  fileUrl: {
    type: String,
    required: true, 
  },
}, { timestamps: true }); 

// Create the Resume model
const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
