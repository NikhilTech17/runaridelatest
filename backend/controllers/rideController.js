const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, distance, totalAmount, rideType } = req.body;

    // Validation
    if (!pickupLocation || !dropLocation || !distance || !totalAmount || !rideType) {
      return res.status(400).json({ message: 'Please provide all required ride details' });
    }

    // Create ride
    const ride = await Ride.create({
      userId: req.user._id,
      pickupLocation,
      dropLocation,
      distance,
      totalAmount,
      rideType
    });

    res.status(201).json({
      _id: ride._id,
      userId: ride.userId,
      pickupLocation: ride.pickupLocation,
      dropLocation: ride.dropLocation,
      distance: ride.distance,
      totalAmount: ride.totalAmount,
      rideType: ride.rideType,
      status: ride.status,
      createdAt: ride.createdAt
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ message: 'Server error while creating ride' });
  }
};

// @desc    Get ride by ID
// @route   GET /api/rides/:id
// @access  Private
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('userId', 'fullName phone email');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user owns this ride
    if (ride.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ride' });
    }

    res.json(ride);
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
// @access  Private
const updateRideStatus = async (req, res) => {
  try {
    const { status, driverId } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide status' });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Update ride status
    ride.status = status;
    
    // If driver is assigned, update driverId
    if (driverId) {
      ride.driverId = driverId;
    }

    const updatedRide = await ride.save();

    res.json(updatedRide);
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all rides for a user
// @route   GET /api/rides/user/:userId
// @access  Private
const getUserRides = async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(rides);
  } catch (error) {
    console.error('Get user rides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current active ride
// @route   GET /api/rides/active
// @access  Private
const getActiveRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      userId: req.user._id,
      status: { $in: ['searching', 'accepted', 'ongoing'] }
    }).sort({ createdAt: -1 });

    res.json(ride || null);
  } catch (error) {
    console.error('Get active ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Find available driver and assign to ride
// @route   POST /api/rides/:id/find-driver
// @access  Private
const findDriverForRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Find any available driver
    const availableDriver = await Driver.findOne({ isAvailable: true });

    if (!availableDriver) {
      return res.status(404).json({ message: 'No available drivers found' });
    }

    // Assign driver to ride
    ride.driverId = availableDriver.userId;
    ride.status = 'accepted';
    await ride.save();

    // Mark driver as unavailable
    availableDriver.isAvailable = false;
    await availableDriver.save();

    res.json({
      message: 'Driver assigned successfully',
      ride: {
        _id: ride._id,
        status: ride.status,
        driverId: ride.driverId
      }
    });
  } catch (error) {
    console.error('Find driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Driver accepts a ride
// @route   PUT /api/rides/:id/accept
// @access  Private
const acceptRide = async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: 'Driver ID is required' });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if ride is still searching
    if (ride.status !== 'searching') {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }

    // Assign driver to ride
    ride.driverId = driverId;
    ride.status = 'accepted';
    await ride.save();

    // Mark driver as unavailable
    const driver = await Driver.findOne({ userId: driverId });
    if (driver) {
      driver.isAvailable = false;
      await driver.save();
    }

    res.json({
      message: 'Ride accepted successfully',
      ride: {
        _id: ride._id,
        status: ride.status,
        driverId: ride.driverId
      }
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ message: 'Server error while accepting ride' });
  }
};

module.exports = { 
  createRide, 
  getRideById, 
  updateRideStatus, 
  getUserRides, 
  getActiveRide,
  findDriverForRide,
  acceptRide
};
