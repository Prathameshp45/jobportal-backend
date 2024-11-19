const Job = require('../models/Job'); 

// Create a new job sdvs
const createJob = async (req, res) => {
  try {
    const { jobTitle, companyName, jobDescription, requirements } = req.body;

    if (!jobTitle || !companyName || !jobDescription || !requirements) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newJob = new Job({
      jobTitle,
      companyName,
      jobDescription,
      requirements,
    });

    await newJob.save();
    return res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    console.log(jobs)
    return res.status(200).json( jobs );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json(error);
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  const jobId = req.params.id;
    console.log('job Id',jobId);

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json( job );
  } catch (error) {
    console.error('Error fetching job by ID:', error.message);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// Update a job
const updateJob = async (req, res) => {
    const jobId = req.params.id;
    const updateData = req.body;
  
    try {
      const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
        new: true, 
        runValidators: true, 
      });
  
      if (!updatedJob) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      return res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (error) {
      console.error('Error updating job:', error.message);
      return res.status(500).json({ error: 'Server Error' });
    }
  };

// Delete a job
const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error.message);
    return res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
