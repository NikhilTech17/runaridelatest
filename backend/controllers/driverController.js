const Driver = require('../models/Driver');
const User = require('../models/User');

// @desc    Register a new driver
// @route   POST /api/drivers/register
// @access  Private
const registerDriver = async (req, res) => {
  try {
    const { userId, vehicleType, vehicleNumber } = req.body;

    // Validation
    if (!userId || !vehicleType || !vehicleNumber) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if driver already exists for this user
    const existingDriver = await Driver.findOne({ userId });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver registration already exists for this user' });
    }

    // Create driver
    const driver = await Driver.create({
      userId,
      vehicleType,
      vehicleNumber
    });

    res.status(201).json({
      message: 'Driver registered successfully',
      driver: {
        _id: driver._id,
        userId: driver.userId,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        isAvailable: driver.isAvailable
      }
    });
  } catch (error) {
    console.error('Driver registration error:', error);
    res.status(500).json({ message: 'Server error during driver registration' });
  }
};

// @desc    Get driver profile
// @route   GET /api/drivers/:id
// @access  Private
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('userId', 'fullName email phone');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update driver availability
// @route   PUT /api/drivers/:id/status
// @access  Private
const updateDriverStatus = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({
      message: `Driver is now ${isAvailable ? 'available' : 'unavailable'}`,
      driver: {
        _id: driver._id,
        isAvailable: driver.isAvailable
      }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Accept ride request
// @route   POST /api/drivers/:id/accept-ride
// @access  Private
const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: 'Ride ID is required' });
    }

    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (!driver.isAvailable) {
      return res.status(400).json({ message: 'Driver is not available' });
    }

    res.json({
      message: 'Ride accepted successfully',
      rideId,
      driverId: driver._id
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Complete ride
// @route   POST /api/drivers/:id/complete-ride
// @access  Private
const completeRide = async (req, res) => {
  try {
    const { rideId, finalAmount } = req.body;

    if (!rideId || !finalAmount) {
      return res.status(400).json({ message: 'Ride ID and final amount are required' });
    }

    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Update driver stats
    driver.totalRides += 1;
    driver.totalEarnings += finalAmount * 0.8; // Driver gets 80% of fare
    driver.isAvailable = true; // Make driver available again
    
    await driver.save();

    res.json({
      message: 'Ride completed successfully',
      earnings: driver.totalEarnings,
      totalRides: driver.totalRides
    });
  } catch (error) {
    console.error('Complete ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerDriver,
  getDriverProfile,
  updateDriverStatus,
  acceptRide,
  completeRide
};
