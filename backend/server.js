const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/drivers', require('./routes/drivers'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Run A Ride API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ PORT FIX (IMPORTANT)
const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('driver-online', (data) => {
    socket.driverId = data.driverId;
    socket.isDriver = true;
    console.log(`🚗 Driver ${data.driverId} is now online`);
  });
  
  socket.on('ride-request', (data) => {
    console.log('🚗 Ride request received:', data.rideId);
    
    io.emit('new-ride-request', {
      rideId: data.rideId,
      pickupLocation: data.pickupLocation,
      dropLocation: data.dropLocation,
      distance: data.distance,
      totalAmount: data.totalAmount,
      rideType: data.rideType,
      passengerName: data.passengerName,
      timestamp: new Date().toISOString()
    });

    socket.emit('ride-request-sent', {
      message: 'Finding nearby drivers...',
      rideId: data.rideId
    });
  });
  
  socket.on('accept-ride', (data) => {
    console.log('✅ Ride accepted by driver:', data.driverId);
    
    io.emit('ride-accepted', {
      rideId: data.rideId,
      driverId: data.driverId,
      driverName: data.driverName,
      vehicleNumber: data.vehicleNumber,
      message: 'Driver accepted your ride!'
    });
  });
  
  socket.on('update-ride-status', (data) => {
    console.log('🔄 Ride status updated:', data.status);
    
    io.emit('ride-status-update', {
      rideId: data.rideId,
      status: data.status,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });
  
  socket.on('driver-offline', (data) => {
    console.log(`🔴 Driver ${data.driverId} went offline`);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Make io available in routes
app.set('io', io);

// ✅ FINAL FIXED SERVER START
server.listen(PORT, () => {
  console.log(`🚀 Run A Ride server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || `http://localhost:${PORT}`}`);
  console.log(`🔌 Socket.io ready for real-time features`);
});

module.exports = { app, server, io };