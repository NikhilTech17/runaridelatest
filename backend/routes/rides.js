const express = require('express');
const router = express.Router();
const { 
  createRide, 
  getRideById, 
  updateRideStatus, 
  getUserRides, 
  getActiveRide,
  findDriverForRide,
  acceptRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createRide);
router.post('/:id/find-driver', findDriverForRide);
router.put('/:id/accept', acceptRide);
router.get('/active', getActiveRide);
router.get('/user/:userId', getUserRides);
router.get('/:id', getRideById);
router.put('/:id/status', updateRideStatus);

module.exports = router;
