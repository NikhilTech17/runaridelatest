const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword
    });

    if (user) {
      // Generate JWT token
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
