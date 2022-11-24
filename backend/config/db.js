const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//connecting database 
const connectDB = async () => {
  try {
    await mongoose.connect(db);

    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    // exit process
    process.exit(1);
  }
};

module.exports = connectDB;
