const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please provide pickup location'],
    trim: true
  },
  dropLocation: {
    type: String,
    required: [true, 'Please provide drop location'],
    trim: true
  },
  distance: {
    type: Number, // in kilometers
    required: [true, 'Distance is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  rideType: {
    type: String,
    enum: ['auto', 'car', 'cab'],
    required: [true, 'Please select a ride type']
  },
  status: {
    type: String,
    enum: ['searching', 'accepted', 'ongoing', 'completed', 'cancelled'],
    default: 'searching'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
rideSchema.index({ userId: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ driverId: 1 });

module.exports = mongoose.model('Ride', rideSchema);
