const express = require('express');
const router = express.Router();
const { 
  registerDriver, 
  getDriverProfile, 
  updateDriverStatus,
  acceptRide,
  completeRide
} = require('../controllers/driverController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Driver routes
router.post('/register', registerDriver);
router.get('/:id', getDriverProfile);
router.put('/:id/status', updateDriverStatus);
router.post('/:id/accept-ride', acceptRide);
router.post('/:id/complete-ride', completeRide);

module.exports = router;
