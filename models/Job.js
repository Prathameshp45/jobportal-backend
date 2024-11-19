const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  jobDescription: { type: String, required: true },
  requirements: { type: String, required: true },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
