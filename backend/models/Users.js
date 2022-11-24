const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  contactNo: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  userImage: {
    type: String,
  },
  age: {
    type: String,
  },
  userReports: [String], // this will be id of images
});

module.exports = Users = mongoose.model('user', UsersSchema);
