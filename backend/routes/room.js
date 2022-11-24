const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');

const Room = require('../models/RoomCategory');

const mongoURI = config.get('mongoURI');

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'roomImages',
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
        bucketName: 'roomImages',
      };
    } else {
      return null;
    }
  },
});
const upload = multer({ storage });

//@route   Get /api/category/room
//@desc    get the room number
router.get('/room/length', auth, async (req, res) => {
  try {
    const rooms = await Room.find();

    const roomNumber = rooms.length;

    res.json(roomNumber);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route   Get /api/category/room
//@desc    get the room data
router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find();

    res.json(rooms);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@desc get single room data
router.get('/room/:room_id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.room_id);
    res.json(room);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route    POST /api/category/room
//@desc     add room category details
router.post(
  '/room',
  [
    check('name', 'Name of room is required.').not().isEmpty(),
    check('numberOfBed', 'Number of bed is required.').not().isEmpty(),
    check('details', 'Details of room is required.').not().isEmpty(),
    check('price', 'Price of room is required.').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      numberOfBed,
      details,
      price,
      uploadRoomImgId,
      availableRooms,
    } = req.body;

    const roomFields = {};
    roomFields.roomImage = uploadRoomImgId;
    if (name) roomFields.name = name;
    if (numberOfBed) roomFields.numberOfBed = numberOfBed;
    if (details) roomFields.details = details;
    if (price) roomFields.price = price;
    if (availableRooms) roomFields.availableRooms = availableRooms;
    try {
      let room = await Room.find({ admin: req.admin.id });
      room = new Room(roomFields);
      await room.save();
      const rooms = await Room.find();
      res.json(rooms);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('SErver Error');
    }
  }
);

//@route    DELETE /api/category/room/:room_id
//@desc     delete the room and its details
router.delete('/room/:room_id', auth, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.room_id);

    res.json({ msg: 'Room has been successfully deleted.' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('SErver Error');
  }
});

//@route    PUT /api/category/room/:room_id
//@desc     edit room details
router.put('/room/:room_id', auth, async (req, res) => {
  const { name, numberOfBed, details, price, availableRooms } = req.body;
  try {
    const room = await Room.findById(req.params.room_id);

    if (name) room.name = `${name}`;
    if (numberOfBed) room.numberOfBed = `${numberOfBed}`;
    if (details) room.details = `${details}`;
    if (price) room.price = `${price}`;
    if (availableRooms) room.availableRooms = `${availableRooms}`;

    await room.save();
    res.json(room);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

/////////////////////////////////////////////////////
// this is for upload
// is used to upload images of room
///////////////////////////////////////////////////
//upload codes

router.post('/room/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { id } = file;
    if (file.size > 5000000) {
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

router.get('/room/image/:id', ({ params: { id } }, res) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id');

  const _id = new mongoose.Types.ObjectId(id);

  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(400).send('no files exists');
    }
    gfs.openDownloadStream(_id).pipe(res);
  });
});

router.delete('/room/image/:id', (req, res) => {
  const id = req.params.id;
  if (!id || id === undefined)
    return res.status(400).send('Image Id not found');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');

    res.send('Image Successfully Deleted.');
  });
});

module.exports = router;
