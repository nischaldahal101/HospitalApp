const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  coordinates: [String, String],
});

module.exports = Emergency = mongoose.model('emergency', EmergencySchema);
