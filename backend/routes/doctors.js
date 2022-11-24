const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');

const Doctor = require('../models/Doctors');

////////////////upload part start//////////////////
const mongoURI = config.get('mongoURI');
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'doctorImages',
  });
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp'
    ) {
      return {
        bucketName: 'doctorImages',
      };
    } else {
      return null;
    }
  },
});
const upload = multer({ storage });

const deleteImage = (id) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');
  });
};

//@route  POST /api/category/doctor/upload
//@desc   add doctor image to the bucket/db
router.post('/doctor/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { id } = file;
    if (file.size > 5000000) {
      deleteImage(id);
      return res.status(400).send('File Size may not exceed 5mb.');
    }
    console.log('uploaded file:', file);
    return res.send(file);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  GET /api/category/doctor/image/:id
//@desc   stream doctor image to the browser
router.get('/doctor/image/:id', ({ params: { id } }, res) => {
  if (!id || id === undefined) return res.status(400).send('no image id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(400).send('Files does not exists.');
    }
    gfs.openDownloadStream(_id).pipe(res);
  });
});

//@route  DELETE /api/category/doctor/image/:id
//@desc   delete image from the database
router.delete('/doctor/image/:id', (req, res) => {
  const id = req.params.id;
  if (!id || id === undefined)
    return res.status(400).send('Image Id not found');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('Image Deletion Error');
    res.send('Image Successfully Deleted.');
  });
});
////////////////upload part end////////////////////

//@route  GET /api/category/doctors/length
//@desc   get the doctrs number for dashboard
router.get('/doctors/length', auth, async (req, res) => {
  try {
    const doctors = await Doctor.find();

    const doctorNumber = doctors.length;
    res.json(doctorNumber);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  GET /api/category/doctors
//@desc   get all of the doctors from the database
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.json(doctors);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@DESC  get the single doctor data
router.get('/doctor/:doctor_id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctor_id);
    res.json(doctor);
  } catch (error) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  POST /api/category/doctor
//@desc   add doctor details to the database
router.post(
  '/doctor',
  auth,
  [
    check('name', 'Doctor Name is required').not().isEmpty(),
    check('contactNo', 'Doctor Contact Number is required').not().isEmpty(),
    check('address', 'Doctor Address is required').not().isEmpty(),
    check('education', 'Doctor Education is required').not().isEmpty(),
    check('speciality', 'Doctor sepicality field is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      name,
      contactNo,
      address,
      education,
      speciality,
      uploadDoctorImgId,
    } = req.body;

    const doctorFields = {};
    if (uploadDoctorImgId) doctorFields.doctorPic = uploadDoctorImgId;
    if (name) doctorFields.name = name;
    if (contactNo) doctorFields.contactNo = contactNo;
    if (address) doctorFields.address = address;
    if (education) doctorFields.education = education;
    if (speciality) doctorFields.speciality = speciality;

    try {
      const doctor = new Doctor(doctorFields);
      await doctor.save();
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@route  PUT /api/category/doctor/:doctor_id
//@desc   Edit doctor details
router.put('/doctor/:doctor_id', auth, async (req, res) => {
  const { name, contactNo, address, education, speciality } = req.body;

  try {
    const doctor = await Doctor.findById(req.params.doctor_id);

    if (name) doctor.name = name;
    if (contactNo) doctor.contactNo = contactNo;
    if (address) doctor.address = address;
    if (education) doctor.education = education;
    if (speciality) doctor.speciality = speciality;

    await doctor.save();
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route  DELETE /api/category/doctor/:doctor_id
//@desc   delete the doctor from the database
router.delete('/doctor/:doctor_id', auth, async (req, res) => {
  try {
    // delete doctor text data
    const doctor = await Doctor.findById(req.params.doctor_id);

    const id = doctor.doctorPic;
    const _id = new mongoose.Types.ObjectId(id);

    gfs.delete(_id, (err) => {
      if (err) return res.status(500).send('Image deletion error.');
    });

    await Doctor.findByIdAndDelete(req.params.doctor_id);
    res.send('Doctor details successfully deleted.');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@desc  delete the appointment date after it is finished.
router.delete('/doctor/:doctor_id/booking/:booking_id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctor_id);

    const index = doctor.bookedDate
      .map((x) => x.id)
      .indexOf(req.params.booking_id);

    if (index === -1) {
      return res.status(404).json({ msg: 'Booking not found.' });
    }

    doctor.bookedDate.splice(index, 1);

    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@desc add available date and time of doctor
router.post(
  '/doctor/:doctor_id/availabletime',
  [check('date', 'Available Date is required.').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { date } = req.body;
    const available = {};
    if (date) available.date = date;
    try {
      const doctor = await Doctor.findById(req.params.doctor_id);
      doctor.available.unshift(available);
      await doctor.save();
      res.json(doctor);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@ desc delete the available date
router.delete('/doctor/:doctor_id/availabletime/:time_id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctor_id);

    const index = doctor.available.map((x) => x.id).indexOf(req.params.time_id);

    doctor.available.splice(index, 1);
    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@desc add available time
router.post(
  '/doctor/:doctor_id/availabletime/:time_id',
  [
    check('from', 'From time is required.').not().isEmpty(),
    check('to', 'To Time is required.').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { from, to } = req.body;

    const time = {};
    if (from) time.from = from;
    if (to) time.to = to;

    try {
      const doctor = await Doctor.findById(req.params.doctor_id);

      const index = doctor.available
        .map((x) => x.id)
        .indexOf(req.params.time_id);

      doctor.available[index].time.push(time);
      await doctor.save();
      res.json(doctor);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@desc delete available time
router.delete(
  '/doctor/:doctor_id/availabletime/:time_id/:id',
  async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.doctor_id);

      const timeIndex = doctor.available
        .map((x) => x.id)
        .indexOf(req.params.time_id);

      const reqTime = doctor.available[timeIndex].time;

      const index = reqTime.map((x) => x.id).indexOf(req.params.id);

      reqTime.splice(index, 1);
      await doctor.save();
      res.json(doctor);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

module.exports = router;
