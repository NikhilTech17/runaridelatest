const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Driver must be associated with a user account']
  },
  vehicleType: {
    type: String,
    enum: ['auto', 'car', 'cab'],
    required: [true, 'Please select vehicle type']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    uppercase: true,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for faster queries
driverSchema.index({ userId: 1 });
driverSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Driver', driverSchema);
