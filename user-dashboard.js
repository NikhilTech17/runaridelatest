// User Dashboard Logic - Simplified

const API_BASE_URL = window.location.origin + '/api';
let currentUser = null;
let allRides = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  await initDashboard();
});

async function initDashboard() {
  // Check authentication
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    window.location.href = 'signin.html';
    return;
  }
  
  try {
    // Get user info from localStorage
    currentUser = {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName')
    };
    
    // Initialize Socket.io
    initSocket();
    setupSocketListeners();
    
    // Load user data
    loadUserData();
    
    // Load ride history
    await loadRideHistory();
    
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    alert('Session expired. Please login again.');
    window.location.href = 'signin.html';
  }
}

// Load user data
function loadUserData() {
  document.getElementById('userName').textContent = currentUser.name || 'User';
  document.getElementById('userEmail').textContent = 'User';
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('welcomeMessage').textContent = `${greeting}, ${currentUser.name || 'User'}!`;
}

// Load ride history
async function loadRideHistory() {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/rides/user/${currentUser.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      allRides = await response.json();
      displayRides(allRides);
      updateStats(allRides);
    }
  } catch (error) {
    console.error('Error loading rides:', error);
    document.getElementById('rideList').innerHTML = `
      <li class="empty-state">
        <i class="fas fa-car"></i>
        <p>Error loading rides</p>
      </li>
    `;
  }
}

// Display rides
function displayRides(rides) {
  const rideList = document.getElementById('rideList');
  
  if (rides.length === 0) {
    rideList.innerHTML = `
      <li class="empty-state">
        <i class="fas fa-car"></i>
        <p>No rides yet. Book your first ride!</p>
      </li>
    `;
    return;
  }
  
  rideList.innerHTML = rides.map(ride => `
    <li class="ride-item">
      <div class="ride-info">
        <h4>${ride.pickupLocation} → ${ride.dropLocation}</h4>
        <div class="ride-meta">
          <div class="meta-item">
            <i class="fas fa-road"></i>
            <span>${ride.distance} km</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-calendar"></i>
            <span>${new Date(ride.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-car"></i>
            <span>${ride.rideType}</span>
          </div>
        </div>
      </div>
      <div class="ride-footer">
        <span class="ride-status status-${ride.status}">${ride.status}</span>
        <span class="ride-amount">₹${ride.totalAmount}</span>
      </div>
    </li>
  `).join('');
}

// Update statistics
function updateStats(rides) {
  const totalRides = rides.length;
  const totalSpent = rides.reduce((sum, ride) => sum + (ride.totalAmount || 0), 0);
  
  document.getElementById('totalRides').textContent = totalRides;
  document.getElementById('totalSpent').textContent = '₹' + totalSpent;
  document.getElementById('profileRides').textContent = totalRides;
  document.getElementById('thisMonth').textContent = totalRides;
}

// Setup Socket.io listeners
function setupSocketListeners() {
  // Listen for ride accepted
  onRideAccepted((data) => {
    alert('🎉 Driver accepted your ride!\n\nDriver: ' + data.driverName + '\nVehicle: ' + data.vehicleNumber);
    loadRideHistory(); // Refresh ride list
  });
  
  // Listen for ride status updates
  onRideStatusUpdate((data) => {
    alert('Ride Status: ' + data.status + '\n' + data.message);
    loadRideHistory(); // Refresh ride list
  });
  
  // Listen for ride request sent
  onRideRequestSent((data) => {
    console.log('Ride request sent successfully');
  });
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  disconnectSocket();
  window.location.href = 'index.html';
}
