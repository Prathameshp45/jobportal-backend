// const multer = require('multer');
// const Resume = require('../models/Resume');

// // Multer setup for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]); 
//   },
// });

// const upload = multer({ storage });

// // Controller function for uploading resume
// const uploadResume = async (req, res) => {
// const jobId = req.params.id
  
//   const resumes = req.file ? req.file.filename  : null
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });  
//   }

//   try {
//     const resume = new Resume({
//       user: req.user.userId,  
//       jobId:jobId,
//       fileUrl: resumes,  
//     });

//     await resume.save();  
//     res.status(201).json(resume);  
//   } catch (err) {
//     console.error('Error uploading resume:', err);
//     res.status(500).json(err);  
//   }
// };

// module.exports = { uploadResume, upload };

const multer = require('multer');
const Resume = require('../models/Resume');
const path = require('path');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Destination folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // File name includes timestamp
  },
});

const upload = multer({ storage });

// Controller function for uploading resume
const uploadResume = async (req, res) => {
  const jobId = req.params.id;
  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const resumeUrl = `http://localhost:5000/uploads/${req.file.filename}`; // Assuming the file is saved in 'uploads/' folder

  try {
    const resume = new Resume({
      user: req.user.userId,  // Assuming you're sending a userId with authentication
      jobId: jobId,
      fileUrl: resumeUrl,  // Store the file URL in the database
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    console.error('Error uploading resume:', err);
    res.status(500).json(err);
  }
};

const getResumeByUserId = async (req, res) => {
  const  userId  = req.params.id; // Expect resumeId as a parameter

  try {
    const resume = await Resume.findOne({user:userId}); // Populate user and jobId fields
    console.log(resume)
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    const modifiedResume = {
      _id: resume._id, 
      userId: resume.user,
      jobId: resume.jobId,
      fileUrl: resume.fileUrl ? `http://localhost:5000/uploads/${resume.fileUrl}`: null, 
    }
    res.status(200).json(modifiedResume);
  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json(err);
  }
};
const getResumesByJobId = async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const resumes = await Resume.find({ jobId: jobId }).populate('user', 'name email'); // Populate user fields if needed
    if (!resumes) {
      return res.status(404).json({ message: 'No resumes found for this job' });
    }
    const modifiedResume = resumes.map((resume)=>({
      _id: resume._id,
      userId: resume.user,
      jobId: resume.jobId,
      fileUrl: resume.fileUrl ? `http://localhost:5000/uploads/${resume.fileUrl}`:null, 
    }))
      
    res.status(200).json(modifiedResume);
  } catch (err) {
    console.error('Error fetching resumes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { uploadResume ,getResumeByUserId, upload ,getResumesByJobId};
