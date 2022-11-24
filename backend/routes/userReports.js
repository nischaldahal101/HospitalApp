const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../middleware/auth');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const User = require('../models/Users');

const mongoURI = config.get('mongoURI');
const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'userReportImages',
  });
});

// for to store user reports file
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      return {
        bucketName: 'userReportImages',
      };
    } else {
      return null;
    }
  },
});
const upload = multer({ storage });

//@desc upload user profile picture
router.post(
  '/upload/report/:user_id',
  auth,
  upload.single('file'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.user_id);

      if (req.file.id) user.userReports.unshift(`${req.file.id}`);
      await user.save();

      const { file } = req;
      const { id } = file;
      if (file.size > 5000000) {
        // if the file is too large, delete it and send an error
        deleteReportImage(id);
        return res.status(400).send('file may not exceed 5mb');
      }
      console.log('uploaded file: ', file);
      return res.send(file);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

const deleteReportImage = (id) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');
  });
};

//@desc get user image to browser
router.get('/image/report/:id', ({ params: { id } }, res) => {
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
router.delete('/image/report/:id', async (req, res) => {
  const id = req.params.id;
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');
  });
  res.json({ msg: 'Successfully deleted.' });
});

//@desc to delete image id from userReport array in the user data
router.delete('/image/report/:user_id/:image_id', async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    const index = user.userReports.map((x) => x).indexOf(req.params.image_id);
    user.userReports.splice(index, 1);
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
