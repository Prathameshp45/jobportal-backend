const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const path = require('path');


dotenv.config();

const app = express();

// Middleware
app.use(express.json()); 

app.use(cors());
let Job;
try {
  Job = mongoose.model('Job');  // Check if model already exists
} catch (error) {
  // If the model doesn't exist, create it
  Job = mongoose.model('Job', new mongoose.Schema({
    jobTitle: String,
    companyName: String,
    description: String,
    requirements: String,
  }));
}

// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/resumes', resumeRoutes);

app.put('/api/jobs/updateJob/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const updatedJobData = req.body;

    const job = await Job.findByIdAndUpdate(jobId, updatedJobData, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
});

// Delete Job
app.delete('/api/jobs/deleteJob/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
});

// // Fetch Jobs (for demo purpose)
// app.get('/api/applications/job/:jobId', async (req, res) => {
//   const jobId = req.params.jobId; // Get the job ID from the URL parameter

//   try {
//     // Fetch the job applications from the database for the given job ID
//     const applications = await Application.find({ jobId }); // Replace Application with your model name

//     if (applications.length === 0) {
//       return res.status(404).json({ message: 'No applications found for this job.' });
//     }

//     res.status(200).json(applications); // Send back the list of applications
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching applications' });
//   }
// });
// Express route to fetch applications for a specific job
app.get('/api/applications/job/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Find the job to get the company name (assuming companyName is a field in the Job model)
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Find applications for the job, populate userId with user details (name, email)
    const applications = await Application.find({ jobId }).populate('userId', 'name email');
    console.log(applications)
    if (!applications) {
      return res.status(404).json({ message: 'No applications found for this job' });
    }

    // Send response with applications and the company name
    res.status(200).json({
      applications,
      companyName: job.companyName,  // Get the company name from the Job model
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/jobs', (req, res) => {
  const { jobTitle, companyName, jobDescription, requirements } = req.body;
  
  // Basic validation
  if (!jobTitle || !companyName || !jobDescription || !requirements) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Simulating storing the job in a database (in this case, just sending it back)
  const newJob = {
    jobTitle,
    companyName,
    jobDescription,
    requirements,
  };

  // Simulate success and return the posted job data
  res.status(200).json({
    message: 'Job posted successfully!',
    job: newJob,
  });
});
// Mock jobs data
// const jobs = [
//   { id: 1, jobTitle: 'Software Engineer', jobCompany: 'Tech Inc.', jobDescription: 'Build amazing software', jobRequirements: 'JavaScript, React' },
//   { id: 2, jobTitle: 'Data Scientist', jobCompany: 'DataWorld', jobDescription: 'Analyze data', jobRequirements: 'Python, Machine Learning' },
// ];

// // Route to fetch jobs
// app.get('/api/jobs', (req, res) => {
//   res.json({ jobs });
// });


// Endpoints
// router.get('/jobs/:jobId/applicants', async (req, res) => {
//   const { jobId } = req.params; // Extract jobId from the URL
//   try {
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     // Find applicants for the specific job (assuming applicants are stored in the database)
//     const applicants = await Applicant.find({ jobId: jobId });

//     res.json(applicants); // Return applicants as a JSON response
//   } catch (error) {
//     console.error("Error fetching applicants:", error);
//     res.status(500).json({ message: "Error fetching applicants" });
//   }
// });




// Application Model
const ApplicationSchema = new mongoose.Schema({
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Application =
  mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

// Routes
app.get('/api/applications/:id', async (req, res) => {
  const { jobId } = req.params.id;

  try {
    const applications = await Application.find({ jobId });
    if (applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this job ID' });
    }
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications for job:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

//multer 












// API route to get job application details (including resume URL)
app.get('/api/applications/:applicationId', async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    
    if (!application) {
      return res.status(404).send({ message: 'Application not found' });
    }

    res.status(200).json(application); // Send application details (including resume)
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching application details' });
  }
});




















// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017/job-portal', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
