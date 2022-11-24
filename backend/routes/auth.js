const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');

const Admins = require('../models/Admins');
const User = require('../models/Users');

//@route POST /api/auth/admin
//@desc login admin to get token
router.post(
  '/admin',
  [
    check('email', 'Email Address is required').isEmail(),
    check('password', 'Password cannot be empty').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const admin = await Admins.findOne({ email });

      if (!admin) {
        return res
          .status(404)
          .json({ msg: 'Invalid Credentials/User doesnt not exists.' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid Credentials.' });
      }

      const payload = {
        admin: {
          id: admin.id,
        },
      };

      jwt.sign(payload, config.get('jwtsecret'), (error, token) => {
        if (error) {
          throw error;
        }
        res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

//@route POST /api/auth/user
//@desc login user to get token
router.post(
  '/user',
  [
    check('email', 'Email Address is required').isEmail(),
    check('password', 'Password cannot be empty').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ msg: 'Invalid Credentials/User doesnt not exists.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid Credentials.' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtsecret'), (error, token) => {
        if (error) {
          throw error;
        }
        res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;
