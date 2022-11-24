const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');

//check up model
const CheckUp = require('../models/CheckupCategory');

////////////////upload part start//////////////////
const mongoURI = config.get('mongoURI');
const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'checkupIcons',
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
        bucketName: 'checkupIcons',
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

//@route   POST /api/category/checkup/upload
//@desc   upload checkup icons
router.post(
  '/checkup/upload',
  auth,
  upload.single('file'),
  async (req, res) => {
    try {
      const { file } = req;
      const { id } = file;
      if (file.size > 5000000) {
        deleteImage(id);
        return res.status(400).send('File size may not exceed 5mb.');
      }
      console.log('uploaded file:', file);
      return res.send(file);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  GET /api/category/checkup/image/:id
//@desc   stream checkup icon to the browser
router.get('/checkup/image/:id', ({ params: { id } }, res) => {
  if (!id || id === undefined) return res.status(400).send('No image id.');

  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(400).send('Files do not exists.');
    }
    gfs.openDownloadStream(_id).pipe(res);
  });
});

//@route  DELETE /api/category/checkup/image/:id
//@desc   delete the icon from the database
router.delete('/checkup/image/:id', (req, res) => {
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

//@route  GET /api/category/checkup
//@desc   Get category data length
router.get('/checkup', auth, async (req, res) => {
  try {
    const categories = await CheckUp.find();

    const categoryNumber = categories.length;

    res.json(categoryNumber);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route GET /api/category/checkups
//@desc get all of the categories
router.get('/checkups', auth, async (req, res) => {
  try {
    const checkups = await CheckUp.find();

    res.json(checkups);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

router.get('/checkup/:checkup_id', auth, async (req, res) => {
  try {
    const checkup = await CheckUp.findById(req.params.checkup_id);
    res.json(checkup);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route  POST /api/category/checkup
//@desc   add checkup category to database
router.post(
  '/checkup',
  [
    check('name', 'Check up name is required').not().isEmpty(),
    check('details', 'Details of checkup is required').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { name, details, uploadCategoryImgId } = req.body;

    const checkupFields = {};
    if (uploadCategoryImgId) checkupFields.checkupIcon = uploadCategoryImgId;
    if (name) checkupFields.name = name;
    if (details) checkupFields.details = details;

    try {
      category = new CheckUp(checkupFields);

      await category.save();

      const categories = await CheckUp.find();

      res.json(categories);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@route  PUT /api/category/checkup/:category_id
//@desc   Add disease data and it details to category using category id
router.put(
  '/checkup/:category_id/disease',
  [
    check('diseaseName', 'Disease Name is required').not().isEmpty(),
    check('diseaseDesc', 'Disease description is required').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { diseaseName, diseaseDesc } = req.body;

    const newDisease = {
      diseaseName,
      diseaseDesc,
    };

    try {
      const category = await CheckUp.findById(req.params.category_id);
      if (!category) {
        return res
          .status(404)
          .json({ msg: 'Category not found. Add some category first.' });
      }

      category.possibleDiseases.push(newDisease);

      await category.save();

      res.json(category);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@route  PUT /api/category/checkup/:category_id
//@desc   Edit category Details
router.put('/checkup/:category_id', auth, async (req, res) => {
  const { name, details } = req.body;

  try {
    const category = await CheckUp.findById(req.params.category_id);
    if (!category) {
      return res
        .status(404)
        .json({ msg: 'Category not found. Add some category first.' });
    }

    if (name) category.name = name;
    if (details) category.details = details;
    await category.save();

    res.json(category);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route  DELETE /api/category/checkup/:category_id
//@desc   Delete the category and its details
router.delete('/checkup/:category_id', auth, async (req, res) => {
  try {
    await CheckUp.findByIdAndDelete(req.params.category_id);

    const categories = await CheckUp.find();
    res.json(categories);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route  DELETE /api/category/checkup/:category_id/disease/:disease_id
//@desc   Delete disease and its details from the category
router.delete(
  '/checkup/:category_id/disease/:disease_id',
  auth,
  async (req, res) => {
    try {
      const category = await CheckUp.findById(req.params.category_id);

      const index = category.possibleDiseases
        .map((x) => x.id)
        .indexOf(req.params.disease_id);

      if (index === -1) {
        return res.status(404).json({ msg: 'Disease details not found.' });
      }

      category.possibleDiseases.splice(index, 1);

      await category.save();
      res.json(category);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@desc add doctor to the category
router.put(
  '/checkup/:category_id/doctor',
  [check('doctorName', 'Doctor name is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doctorId = req.body.doctorId;
    const doctorName = req.body.doctorName;
    const newDoctor = {
      doctorName,
      doctorId,
    };
    try {
      const category = await CheckUp.findById(req.params.category_id);

      category.availableDoctors.push(newDoctor);

      await category.save();
      res.json(category);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@desc delete the doctor from the category
router.delete('/checkup/:category_id/doctor/:doctor_id', async (req, res) => {
  try {
    const category = await CheckUp.findById(req.params.category_id);

    const index = category.availableDoctors
      .map((x) => x._id)
      .indexOf(req.params.doctor_id);

    category.availableDoctors.splice(index, 1);

    await category.save();
    res.json(category);
  } catch (error) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});
module.exports = router;
