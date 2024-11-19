// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Set up the storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Set the folder to store uploaded files
  },
  filename: (req, file, cb) => {
    // Create a unique file name based on timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create the upload middleware
const upload = multer({ storage });

// Export the middleware for use in routes
module.exports = upload;
