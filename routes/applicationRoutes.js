const express = require('express');
const { applyJob, getApplications, getApplicationById, updateApplication, deleteApplication } = require('../controllers/applicationController');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

// POST route for applying for a job (Create)
router.post('/apply/:id', auth, applyJob);  // id is the job ID

// GET route for getting all applications (Read)
router.get('/getApplications', auth, getApplications);

// GET route for getting a specific application by ID (Read)
router.get('/applications/:id', auth, getApplicationById);

// PUT route for updating an application (Update)
router.put('/applications/:id', auth, updateApplication);

// DELETE route for deleting an application (Delete)
router.delete('/applications/:id', auth, deleteApplication);

module.exports = router;
