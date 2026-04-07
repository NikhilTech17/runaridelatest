const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['rider', 'driver'],
    default: 'rider'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

module.exports = mongoose.model('User', userSchema);
