
const Application = require('../models/Application');

// CREATE: Apply for a job
const applyJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id; 

  try {
    const application = await Application.find({userId: userId,jobId: jobId});
    if(!application){
      rrs.status(403).send({message:'already applied'});
    }
    const newApplication = new Application({
      userId,
      jobId,
      appliedAt: Date.now(),
    });

    // Save the new application to the database
    await newApplication.save();
    return res.status(201).json({ message: 'Job application submitted successfully', application: newApplication });
  } catch (error) {
    console.log(error);
    return res.status(500).json( error );
  }
};

// READ: Get all applications
const getApplications = async (req, res) => {

  try {
    const applications = await Application.find();
    console.log(applications)
    return res.status(200).json( applications );
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
};

// READ: Get a specific application by ID
const getApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.status(200).json({ application });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
};

// UPDATE
const updateApplication = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.status(200).json({ message: 'Application updated successfully', application: updatedApplication });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
};

// DELETE: Delete a job application
const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
};

// const getJobApplications = async (req, res) => {

//   try {
//     const applications = await Application.find({ jobId: req.params.jobId }).populate('userId', 'name email').populate('resume', 'fileUrl');
//     console.log(applications)
//     res.status(200).json({ applications });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching applications' });
//   }
// };


module.exports = { applyJob, getApplications, getApplicationById, updateApplication, deleteApplication };
