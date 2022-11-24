const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const User = require('../models/Users');
const Doctor = require('../models/Doctors');
const Room = require('../models/RoomCategory');

//@desc  add user to the database
router.post(
  '/',
  [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password should be 6 or more of characters.').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(401).json({ msg: 'User already exists.' });
      }

      user = new User({
        firstName,
        lastName,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: 3600 },
        (error, token) => {
          if (error) {
            throw error;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@desc get all of the users from DB
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@desc get users data length
router.get('/users/length', async (req, res) => {
  try {
    const users = await User.find();
    const usersLength = users.length;
    res.json(usersLength);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@desc get single user from db -- for user only
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@desc get sinlge user using id from parameters
router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

/////////////////////////////////////////////////////
// this is for upload
// is is used during upload profile picture of admin
/////////////////////////////////////////////////////
const mongoURI = config.get('mongoURI');
const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'userImages',
  });
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg') {
      return {
        bucketName: 'userImages',
      };
    } else {
      return null;
    }
  },
});
const upload = multer({ storage });

//@desc upload user profile picture
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.file.id) user.userImage = `${req.file.id}`;
    await user.save();

    const { file } = req;
    const { id } = file;
    if (file.size > 5000000) {
      // if the file is too large, delete it and send an error
      deleteImage(id);
      return res.status(400).send('file may not exceed 5mb');
    }
    console.log('uploaded file: ', file);
    return res.send(file);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

const deleteImage = (id) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');
  });
};

//@desc get user image to browser
router.get('/image/:id', ({ params: { id } }, res) => {
  if (!id || id === 'undefined')
    return res.status(400).json({ msg: 'No image Id' });
  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).json({ msg: 'No files exists.' });

    gfs.openDownloadStream(_id).pipe(res);
  });
});

//@desc to delete image
// you can use this same route to delete previous image when user changes profile picture
router.delete('/image/:id', (req, res) => {
  const id = req.params.id;
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');

    res.send('successfully deleted.');
  });
});

//@desc add profile data to user database/can be also used to edit user profile details;
router.put(
  '/',
  auth,
  [
    check('gender', 'Gender is required').not().isEmpty(),
    check('contactNo', 'Contact Number is required').not().isEmpty(),
    check('bloodGroup', 'Blood group is required').not().isEmpty(),
    check('age', 'Age is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { gender, contactNo, bloodGroup, age } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (gender) user.gender = gender;
      if (contactNo) user.contactNo = contactNo;
      if (bloodGroup) user.bloodGroup = bloodGroup;
      if (age) user.age = age;

      await user.save();

      res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@desc route to book doctor by date
router.put(
  '/book/doctor/:doctor_id/:date_id/availabletime/:time_id',
  [
    check('date', 'Booked Date is required').not().isEmpty(),
    check('from', 'Booking from time is required').not().isEmpty(),
    check('to', 'Booking To time is required.').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const doctor = await Doctor.findById(req.params.doctor_id);

      if (!doctor) {
        return res.status(404).json({ msg: 'Doctor not found.' });
      }

      const { date, from, to } = req.body;
      const bookedBy = req.user.id;

      const alreadyBooked = doctor.bookedDate.find(
        (x) => x.bookedBy === req.user.id
      );

      if (alreadyBooked) {
        return res.status(400).json({
          msg: 'You have already booked this doctor.',
        });
      }
// to check if same time
      const sameTime = doctor.bookedDate.find((x) => x.from === from);

      if (sameTime) {
        return res.status(400).json({
          msg: 'Doctor for this time has already been booked. Please choose next time.',
        });
      }
// for maximum booking
      if (doctor.bookedDate.filter((x) => x.date === date).length === 5) {
        return res.status(400).json({
          msg: 'Sorry the maximum amount of booking for this day is closed. Try again for another date.',
        });
      }

      const dateIndex = doctor.available
        .map((x) => x.id)
        .indexOf(req.params.date_id);

      if (dateIndex === -1) {
        return res
          .status(404)
          .json({ msg: 'The date of you have selected is not available.' });
      }

      const reqDate = doctor.available[dateIndex];

      const timeIndex = reqDate.time
        .map((x) => x.id)
        .indexOf(req.params.time_id);

      if (timeIndex === -1) {
        return res
          .status(404)
          .json({ msg: 'The time you have selected is not available. ' });
      }

      reqDate.time.splice(timeIndex, 1);

      const newBookedInfo = {
        bookedBy,
        date,
        from,
        to,
      };

      doctor.bookedDate.push(newBookedInfo);

      await doctor.save();

      res.json({ msg: 'Sucessfully booked.' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@desc book a room
router.post(
  '/book/room/:room_id',
  [
    check('from', 'From Date is required.').not().isEmpty(),
    check('to', 'To Date is required.').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { from, to } = req.body;
    if (req.user === undefined || req.user === null) {
      return res.status(400).json({ msg: 'Invalid Token.' });
    }

    const newBookingInfo = {};
    if (req.user) newBookingInfo.user = req.user.id;
    if (from) newBookingInfo.from = from;
    if (to) newBookingInfo.to = to;

    try {
      const room = await Room.findById(req.params.room_id);
      room.availableRooms -= 1;
      if (room.availableRooms === 0) {
        return res.status(404).json({
          msg: 'There are no rooms left for this category. Please book another room.',
        });
      }
      room.bookedDate.unshift(newBookingInfo);

      await room.save();
      res.json(room);
    } catch (error) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/book/room/:room_id/:booking_id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.room_id);

    const index = room.bookedDate
      .map((x) => x.id)
      .indexOf(req.params.booking_id);

    room.availableRooms += 1;

    room.bookedDate.splice(index, 1);
    await room.save();

    res.json(room);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
