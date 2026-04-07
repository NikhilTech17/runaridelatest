// Driver Dashboard Logic - Simplified

const API_BASE_URL = window.location.origin + '/api';
let currentDriverId = null;
let currentRideRequest = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    window.location.href = 'signin.html';
    return;
  }
  
  // Load driver profile
  await loadDriverProfile();
  
  // Initialize Socket.io
  initSocket();
  setupSocketListeners();
  
  // Setup availability toggle
  setupAvailabilityToggle();
});

// Load driver profile
async function loadDriverProfile() {
  try {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    // Try to get driver profile
    const response = await fetch(`${API_BASE_URL}/drivers/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const driver = await response.json();
      currentDriverId = driver._id;
      
      // Update UI
      document.getElementById('driverName').textContent = driver.userId?.fullName || 'Driver';
      document.getElementById('vehicleType').textContent = driver.vehicleType || '-';
      document.getElementById('vehicleNumber').textContent = driver.vehicleNumber || '-';
      document.getElementById('totalRides').textContent = driver.totalRides || 0;
      document.getElementById('totalEarnings').textContent = '₹' + (driver.totalEarnings || 0);
      document.getElementById('driverRating').textContent = (driver.rating || 0).toFixed(1);
      document.getElementById('ratingValue').textContent = (driver.rating || 0).toFixed(1);
      
      // Set availability toggle
      document.getElementById('availabilityToggle').checked = driver.isAvailable;
      updateAvailabilityStatus(driver.isAvailable);
      
      // If driver is available, go online
      if (driver.isAvailable) {
        driverOnline(currentDriverId);
      }
    } else {
      // Driver not registered yet
      alert('Please register as a driver first');
      window.location.href = 'driver-register.html';
    }
  } catch (error) {
    console.error('Error loading driver profile:', error);
  }
}

// Setup availability toggle
function setupAvailabilityToggle() {
  const toggle = document.getElementById('availabilityToggle');
  
  toggle.addEventListener('change', async () => {
    const isAvailable = toggle.checked;
    
    try {
      const token = localStorage.getItem('token');
      
      await fetch(`${API_BASE_URL}/drivers/${currentDriverId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable })
      });
      
      updateAvailabilityStatus(isAvailable);
      
      if (isAvailable) {
        driverOnline(currentDriverId);
      } else {
        driverOffline(currentDriverId);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toggle.checked = !isAvailable; // Revert toggle
    }
  });
}

// Update availability status UI
function updateAvailabilityStatus(isAvailable) {
  const statusBadge = document.getElementById('statusBadge');
  const availabilityText = document.getElementById('availabilityText');
  
  if (isAvailable) {
    statusBadge.textContent = 'Available';
    statusBadge.className = 'status-badge status-available';
    availabilityText.textContent = 'You are:';
  } else {
    statusBadge.textContent = 'Offline';
    statusBadge.className = 'status-badge status-busy';
    availabilityText.textContent = 'You are:';
  }
}

// Setup Socket.io listeners
function setupSocketListeners() {
  console.log('🔧 Setting up Socket.io listeners for driver...');
  console.log('Socket object:', socket);
  console.log('Socket connected:', socket ? socket.connected : false);
  
  // Listen for new ride requests
  onNewRideRequest((data) => {
    console.log('🎯 Ride request callback triggered!');
    currentRideRequest = data;
    showRideRequest(data);
    
    // Play notification sound (optional)
    console.log('🔔 New ride request notification!');
  });
  
  console.log('✅ Socket listeners setup complete');
}

// Show ride request
function showRideRequest(data) {
  document.getElementById('rideRequestCard').style.display = 'block';
  document.getElementById('requestPickup').textContent = data.pickupLocation;
  document.getElementById('requestDrop').textContent = data.dropLocation;
  document.getElementById('requestDistance').textContent = data.distance + ' km';
  document.getElementById('requestFare').textContent = '₹' + data.totalAmount;
}

// Accept ride
async function acceptRide() {
  if (!currentRideRequest) {
    alert('No ride request to accept');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const driverName = localStorage.getItem('userName') || 'Driver';
    const vehicleNumber = document.getElementById('vehicleNumber').textContent;
    
    console.log('Accepting ride:', currentRideRequest.rideId);
    
    // Accept ride via API - assign driver to ride
    const acceptResponse = await fetch(`${API_BASE_URL}/rides/${currentRideRequest.rideId}/accept`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        driverId: localStorage.getItem('userId')
      })
    });
    
    if (!acceptResponse.ok) {
      const error = await acceptResponse.json();
      throw new Error(error.message || 'Failed to accept ride');
    }
    
    // Update ride status to accepted
    await fetch(`${API_BASE_URL}/rides/${currentRideRequest.rideId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        status: 'accepted',
        driverId: localStorage.getItem('userId')
      })
    });
    
    // Notify user via Socket.io - USE socket.emit, not recursive call
    if (typeof socket !== 'undefined' && socket) {
      socket.emit('accept-ride', {
        rideId: currentRideRequest.rideId,
        driverId: localStorage.getItem('userId'),
        driverName: driverName,
        vehicleNumber: vehicleNumber
      });
    }
    
    // Hide request card
    document.getElementById('rideRequestCard').style.display = 'none';
    
    // Update stats
    const totalRidesEl = document.getElementById('totalRides');
    totalRidesEl.textContent = parseInt(totalRidesEl.textContent) + 1;
    
    alert('✅ Ride accepted successfully!');
    currentRideRequest = null;
    
  } catch (error) {
    console.error('Error accepting ride:', error);
    alert('❌ Failed to accept ride: ' + error.message);
  }
}

// Decline ride
function declineRide() {
  document.getElementById('rideRequestCard').style.display = 'none';
  currentRideRequest = null;
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  disconnectSocket();
  window.location.href = 'index.html';
}
