// Booking Logic for Run A Ride - Simplified

const API_BASE_URL = window.location.origin + '/api';

// Calculate fare based on distance and ride type
function calculateFare() {
  const pickup = document.getElementById('pickup').value.trim();
  const drop = document.getElementById('drop').value.trim();
  
  if (!pickup || !drop) {
    alert('Please enter both pickup and drop locations');
    return;
  }
  
  // Simulate distance calculation (in real app, use Google Maps API)
  const distance = calculateDistance(pickup, drop);
  
  // Get selected ride type
  const selectedRide = document.querySelector('input[name="rideType"]:checked');
  const rideOption = selectedRide.closest('.ride-option');
  const baseFare = parseFloat(rideOption.dataset.baseFare);
  const perKmRate = parseFloat(rideOption.dataset.perKm);
  
  // Calculate fares
  const distanceFare = distance * perKmRate;
  const totalAmount = baseFare + distanceFare;
  
  // Display trip info
  document.getElementById('tripInfo').style.display = 'flex';
  document.getElementById('distanceValue').textContent = distance.toFixed(1) + ' km';
  document.getElementById('durationValue').textContent = Math.round(distance * 3) + ' mins';
  
  // Display fare breakdown
  document.getElementById('fareEstimate').style.display = 'block';
  document.getElementById('baseFareDisplay').textContent = '₹' + baseFare.toFixed(2);
  document.getElementById('distanceFareDisplay').textContent = '₹' + distanceFare.toFixed(2);
  document.getElementById('taxesDisplay').textContent = '₹0.00';
  document.getElementById('totalFareDisplay').textContent = '₹' + totalAmount.toFixed(2);
  
  // Enable proceed button
  document.getElementById('proceedBtn').disabled = false;
  
  // Store ride details in localStorage
  const rideDetails = {
    pickupLocation: pickup,
    dropLocation: drop,
    distance: distance.toFixed(1),
    rideType: selectedRide.value,
    totalAmount: totalAmount.toFixed(2)
  };
  
  localStorage.setItem('currentRide', JSON.stringify(rideDetails));
}

// Mock distance calculation function
function calculateDistance(pickup, drop) {
  // Generate a random distance between 2-20 km for demo
  const hash = simpleHash(pickup + drop);
  return 2 + (hash % 18); // Returns 2-20 km
}

// Simple hash function for consistent results
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Handle ride type selection and form submission
document.addEventListener('DOMContentLoaded', function() {
  const rideOptions = document.querySelectorAll('.ride-option');
  
  rideOptions.forEach(option => {
    option.addEventListener('click', function() {
      rideOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      const radio = this.querySelector('input[type="radio"]');
      radio.checked = true;
      
      // Recalculate fare if locations are filled
      const pickup = document.getElementById('pickup').value.trim();
      const drop = document.getElementById('drop').value.trim();
      
      if (pickup && drop && document.getElementById('fareEstimate').style.display === 'block') {
        calculateFare();
      }
    });
  });
  
  // Handle form submission - Book ride
  const bookingForm = document.getElementById('bookingForm');
  
  bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const rideDetails = JSON.parse(localStorage.getItem('currentRide'));
    
    if (!rideDetails) {
      alert('Please calculate fare first');
      return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      alert('Please login to book a ride');
      window.location.href = 'signin.html';
      return;
    }
    
    try {
      // Show loading state
      const submitBtn = document.getElementById('proceedBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
      
      // Create ride in backend
      const rideData = {
        pickupLocation: rideDetails.pickupLocation,
        dropLocation: rideDetails.dropLocation,
        distance: parseFloat(rideDetails.distance),
        totalAmount: parseFloat(rideDetails.totalAmount),
        rideType: rideDetails.rideType
      };
      
      const response = await fetch(`${API_BASE_URL}/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rideData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create ride');
      }
      
      const ride = await response.json();
      
      // Store ride ID
      localStorage.setItem('currentRideId', ride._id);
      
      // Emit ride request via Socket.io
      if (typeof requestRide === 'function') {
        requestRide({
          rideId: ride._id,
          pickupLocation: rideDetails.pickupLocation,
          dropLocation: rideDetails.dropLocation,
          distance: rideDetails.distance,
          totalAmount: rideDetails.totalAmount,
          rideType: rideDetails.rideType,
          passengerName: localStorage.getItem('userName') || 'User'
        });
      }
      
      // Redirect to dashboard to track ride
      alert('Ride booked successfully! Looking for drivers...');
      window.location.href = 'dashboard.html';
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book ride: ' + error.message);
      
      // Reset button
      const submitBtn = document.getElementById('proceedBtn');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Proceed to Book';
    }
  });
});
