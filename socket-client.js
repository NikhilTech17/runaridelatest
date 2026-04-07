// Socket.io Client - Simplified for RunARide

let socket = null;

// Initialize socket connection
function initSocket() {
  if (socket) return socket;
  
  // Connect to backend (same origin in production, or specify URL)
  const socketUrl = window.location.origin;
  socket = io(socketUrl);
  
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });
  
  return socket;
}

// Driver: Go online
function driverOnline(driverId) {
  if (!socket) initSocket();
  
  socket.emit('driver-online', {
    driverId: driverId
  });
  
  console.log('🟢 Driver is now online - Driver ID:', driverId);
}

// Driver: Go offline
function driverOffline(driverId) {
  if (!socket) initSocket();
  
  socket.emit('driver-offline', {
    driverId: driverId
  });
  
  console.log('🔴 Driver is now offline');
}

// User: Request a ride
function requestRide(rideData) {
  if (!socket) initSocket();
  
  console.log('🚗 Emitting ride request:', rideData);
  
  socket.emit('ride-request', {
    rideId: rideData.rideId,
    pickupLocation: rideData.pickupLocation,
    dropLocation: rideData.dropLocation,
    distance: rideData.distance,
    totalAmount: rideData.totalAmount,
    rideType: rideData.rideType,
    passengerName: rideData.passengerName
  });
  
  console.log('🚗 Ride request emitted for ride ID:', rideData.rideId);
}

// Driver: Accept a ride
function acceptRide(rideId, driverId, driverName, vehicleNumber) {
  if (!socket) initSocket();
  
  socket.emit('accept-ride', {
    rideId: rideId,
    driverId: driverId,
    driverName: driverName,
    vehicleNumber: vehicleNumber
  });
  
  console.log('✅ Ride accepted:', rideId);
}

// Update ride status (for both user and driver)
function updateRideStatus(rideId, status, message) {
  if (!socket) initSocket();
  
  socket.emit('update-ride-status', {
    rideId: rideId,
    status: status,
    message: message
  });
  
  console.log('🔄 Ride status updated:', status);
}

// Listen for new ride requests (Driver)
function onNewRideRequest(callback) {
  if (!socket) initSocket();
  
  socket.on('new-ride-request', (data) => {
    console.log('📢 New ride request received!', data);
    console.log('Ride ID:', data.rideId);
    console.log('Pickup:', data.pickupLocation);
    console.log('Drop:', data.dropLocation);
    console.log('Fare: ₹', data.totalAmount);
    callback(data);
  });
}

// Listen for ride accepted (User)
function onRideAccepted(callback) {
  if (!socket) initSocket();
  
  socket.on('ride-accepted', (data) => {
    console.log('✅ Ride accepted:', data);
    callback(data);
  });
}

// Listen for ride status updates (User & Driver)
function onRideStatusUpdate(callback) {
  if (!socket) initSocket();
  
  socket.on('ride-status-update', (data) => {
    console.log('🔄 Ride status update:', data);
    callback(data);
  });
}

// Listen for ride request sent confirmation (User)
function onRideRequestSent(callback) {
  if (!socket) initSocket();
  
  socket.on('ride-request-sent', (data) => {
    console.log('📤 Ride request sent:', data);
    callback(data);
  });
}

// Disconnect socket
function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket disconnected');
  }
}
