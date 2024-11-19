// resumeRoutes.js
const express = require('express');
const router = express.Router();

// Import the upload middleware (ensure the correct path to your upload.js file)
const upload = require('../middleware/upload');  // Adjust this path according to your file structure

// Import your controller functions
const { uploadResume, getResumesByJobId, getResumeByUserId } = require('../controllers/resumeController');
const { auth } = require('../middleware/authMiddleware');

// Define your routes
router.post('/job/:id', upload.single('file'), uploadResume); // Ensure `upload.single('file')` matches your form field name

// Other routes for fetching resumes
router.get('/getResumeByUserId/:id',auth, getResumeByUserId);
router.get('/:id', auth,getResumesByJobId);

module.exports = router;
