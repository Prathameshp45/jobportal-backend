const express = require('express');
const { createJob, getJobs, getJobById,updateJob,deleteJob,} = require('../controllers/jobController');
const { auth } = require('../middleware/authMiddleware'); 
const router = express.Router();

// Create a new job
router.post('/create', auth, createJob);

// Get all jobs
router.get('/getJobs', auth,getJobs);

// Get a job by ID
router.get('/:id', auth,getJobById);

// Update a job by ID
router.put('/:id', auth, updateJob);

// Delete a job by ID
router.delete('/:id', auth, deleteJob);

module.exports = router;
