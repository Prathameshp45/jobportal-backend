// const mongoose = require('mongoose');

// const applicationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   appliedAt: { type: Date, default: Date.now },
//   status: { type: String, default: 'Pending' }, // Optional: "Pending", "Reviewed", "Rejected", "Accepted"
//   resume: { type: String, required: true }
// });
// // const applicationSchema = new mongoose.Schema({
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// //   jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   // resume: { type: String, required: true }, 
// // });


// const Application = mongoose.model('Application', applicationSchema);

// module.exports = Application;

// server/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: {
    fileUrl: { type: String },
  },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema);
