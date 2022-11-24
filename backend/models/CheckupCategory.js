const mongoose = require('mongoose');

const CheckupCategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  details: {
    type: String,
  },
  possibleDiseases: [
    { diseaseName: { type: String }, diseaseDesc: { type: String } },
  ],
  availableDoctors: {
    type: [
      {
        doctorId: String,
        doctorName: String,
      },
    ],
  },
  checkupIcon: {
    type: String,
  },
});

module.exports = CheckupCategory = mongoose.model(
  'checkupcategory',
  CheckupCategorySchema
);
