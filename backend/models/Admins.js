const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  previousPictures: {
    type: [String],
  },
  fullname: {
    type: String,
    required: true,
  },
  position: { type: String, required: true },
  emergencyAlert: [
    {
      user: String,
      read: String,
    },
  ],
});

module.exports = Admins = mongoose.model('Admins', AdminSchema);
