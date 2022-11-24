const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOveride = require('method-override');
const path = require('path');

const app = express();

// mongodb connection
connectDB();

// middleware
app.use(methodOveride('_method'));
// init middleware for body parser
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(
  //permission for all domains
  cors({
    origin: '*',
  })
);

//routes
//endpoint
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Found' });
});
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/category', require('./routes/checkup'));
app.use('/api/category', require('./routes/room'));
app.use('/api/category', require('./routes/doctors'));
app.use('/api/user', require('./routes/user'));
app.use('/api/user', require('./routes/userReports'));
app.use('/api/emergency', require('./routes/emergency'));

// serve static assets in procution
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('../client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server has been started at ${PORT}`));
