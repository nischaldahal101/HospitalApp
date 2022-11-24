const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  numberOfBed: {
    type: Number,
  },
  details: {
    type: String,
  },
  price: {
    type: String,
  },
  roomImage: {
    type: String,
  },
  availableRooms: Number,
  bookedDate: [
    {
      from: String,
      to: String,
      user: String,
    },
  ],
});

module.exports = RoomCategory = mongoose.model('room', RoomSchema);
