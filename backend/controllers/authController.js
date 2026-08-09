const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super-secret-development-key-that-should-be-changed', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);

  // Remove password from output
  user.passwordHash = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await User.create({
      email: email,
      passwordHash: passwordHash
      // Other fields have defaults and role is defaulted to 'student'
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ status: 'fail', message: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Email already exists' });
    }
    res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
  }
};

exports.subscribeToPush = async (req, res) => {
  try {
    const { subscription } = req.body;
    
    if (!subscription) {
      return res.status(400).json({ status: 'fail', message: 'Missing push subscription object' });
    }

    // Save the subscription object to the authenticated user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { pushSubscription: subscription },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', message: 'Successfully subscribed to push notifications.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to subscribe to push notifications', error: err.message });
  }
};
