const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Admins = require('../models/Admins');

router.post(
  '/',
  [
    check('email', 'Please include an valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(401).json({ errors: errors.array() });

    const { email, password, fullname, position } = req.body;
//check if user already exists 
    try {
      let admin = await Admins.findOne({ email });

      if (admin) {
        return res.status(401).json({ msg: 'User already exists' });
      }

      admin = new Admins({
        email,
        password,
        fullname,
        position,
      });

      const salt = await bcrypt.genSalt(10);

      admin.password = await bcrypt.hash(password, salt);

      await admin.save();

      const payload = {
        admin: {
          id: admin.id,
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

router.get('/', async (req, res) => {
  try {
    const admin = await Admins.find();
    res.json(admin);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admins.findById(req.admin.id);
    res.json(admin);
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
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//connection with database
let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'images',
  });
});
//storing in datavase
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg') {
      return {
        bucketName: 'images',
      };
    } else {
      return null;
    }
  },
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const admin = await Admins.findById(req.admin.id);
    if (req.file.id) admin.profilePic = `${req.file.id}`;
    if (req.file.id) admin.previousPictures.push(`${req.file.id}`);
    await admin.save();
    const { file } = req;
    // and the id of that new image file
    const { id } = file;
    // we can set other, smaller file size limits on routes that use the upload middleware
    // set this and the multer file size limit to whatever fits your project
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

// this route will be accessed by any img tags on the front end which have
// src tags like
// <img src="/api/image/123456789" alt="example"/>
// <img src={`/api/image/${user.profilePic}`} alt="example"/>
router.get('/image/:id', ({ params: { id } }, res) => {
  // if no id return error
  if (!id || id === 'undefined')
    return res.status(400).json({ msg: 'No Image id' });
  // if there is an id string, cast it to mongoose's objectId type
  const _id = new mongoose.Types.ObjectId(id);
  // search for the image by id
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send('no files exist');
    // if a file exists, send the data
    gfs.openDownloadStream(_id).pipe(res);
  });
});

router.delete('/image/:id', (req, res) => {
  const id = req.params.id;
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');

    res.send('successfully deleted.');
  });
});

module.exports = router;
