# RunARide - Simple Ride Booking App

A clean, minimal, and fully functional MERN stack ride-booking application. Built for simplicity and ease of deployment.

## 🚀 Features

### User Side
- ✅ Signup / Login with JWT authentication
- ✅ Book rides with pickup and drop locations (text input)
- ✅ Simple fare calculation (base fare + per km rate)
- ✅ Real-time ride status tracking (Searching → Accepted → Completed)
- ✅ View ride history

### Driver Side
- ✅ Driver login
- ✅ Go online/offline toggle
- ✅ Accept or reject ride requests
- ✅ Real-time ride notifications via Socket.io

### Backend
- ✅ Simple REST API with Express
- ✅ JWT-based authentication
- ✅ MongoDB database (Users, Drivers, Rides)
- ✅ Real-time communication with Socket.io
- ✅ Basic ride matching (assign any available driver)

## 📁 Project Structure

```
runaride/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── driverController.js
│   │   └── rideController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Driver.js
│   │   └── Ride.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── drivers.js
│   │   └── rides.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── index.html
├── signin.html
├── signup.html
├── dashboard.html
├── driver-dashboard.html
├── book-ride.html
├── style.css
├── auth.css
├── script.js
├── booking.js
├── user-dashboard.js
├── driver.js
└── socket-client.js
```

## 🛠️ Local Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   cd runaride
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/runaride
   # OR use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/runaride

   # JWT Secret
   JWT_SECRET=your_secret_key_change_this_in_production

   # Frontend URL
   FRONTEND_URL=http://localhost:5000
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Windows
   net start MongoDB

   # Mac/Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the application**
   - Open your browser and go to: `http://localhost:5000`

## 🌐 Deployment

### 1. Deploy Backend to Render/Railway

#### Using Render:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/runaride.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: runaride-api
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/runaride
   JWT_SECRET=your_production_secret_key
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://runaride-api.onrender.com`

### 2. Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Other
     - **Build Command**: Leave empty
     - **Output Directory**: Leave empty
     - **Install Command**: Leave empty

3. **Deploy**
   - Click "Deploy"
   - Your frontend will be live at: `https://runaride.vercel.app`

### 3. Setup MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select cloud provider and region
   - Click "Create"

3. **Configure Access**
   - **Database Access**: Create database user
     - Username: `runaride_user`
     - Password: (generate a strong password)
   - **Network Access**: Add IP address
     - For development: Add your current IP
     - For production: Add `0.0.0.0/0` (allow from anywhere)

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://runaride_user:<password>@cluster0.xxxxx.mongodb.net/runaride?retryWrites=true&w=majority
   ```

5. **Update .env**
   - Replace `MONGODB_URI` with your Atlas connection string

## 📡 API Endpoints

### Authentication
```
POST /api/users/register   - Register new user
POST /api/users/login      - Login user
GET  /api/users/profile    - Get user profile (protected)
```

### Rides
```
POST   /api/rides                - Create new ride (protected)
POST   /api/rides/:id/find-driver - Find driver for ride (protected)
GET    /api/rides/active         - Get active ride (protected)
GET    /api/rides/user/:userId   - Get user rides (protected)
GET    /api/rides/:id            - Get ride by ID (protected)
PUT    /api/rides/:id/status     - Update ride status (protected)
```

### Drivers
```
POST   /api/drivers/register      - Register as driver (protected)
GET    /api/drivers/:id           - Get driver profile (protected)
PUT    /api/drivers/:id/status    - Update driver status (protected)
POST   /api/drivers/:id/accept-ride - Accept ride (protected)
POST   /api/drivers/:id/complete-ride - Complete ride (protected)
```

### Health Check
```
GET /api/health - Check API status
```

## 🔌 Socket.io Events

### Client → Server
```
driver-online      - Driver goes online
driver-offline     - Driver goes offline
ride-request       - User requests a ride
accept-ride        - Driver accepts ride
update-ride-status - Update ride status
```

### Server → Client
```
new-ride-request    - New ride request (to drivers)
ride-accepted       - Ride accepted (to user)
ride-status-update  - Status update (to both)
ride-request-sent   - Confirmation (to user)
```

## 🎯 How to Use

### For Users:
1. Sign up or login
2. Click "Book a Ride"
3. Enter pickup and drop locations
4. Select ride type (Auto/Car/Cab)
5. Click "Calculate Fare"
6. Click "Proceed to Book"
7. Wait for driver to accept
8. Track ride status in dashboard

### For Drivers:
1. Login with driver account
2. Toggle "Available" to go online
3. Wait for ride requests
4. Accept or decline rides
5. Complete rides to earn

## 🧪 Testing

### Test Locally:
1. Open two browser windows
2. Window 1: Login as user
3. Window 2: Login as driver and go online
4. Window 1: Book a ride
5. Window 2: Accept the ride
6. Watch real-time updates!

## 📝 Important Notes

- **For Production**: Change `JWT_SECRET` to a strong random string
- **MongoDB**: Use MongoDB Atlas for production deployment
- **Security**: Add rate limiting and HTTPS in production
- **Scalability**: This is a simplified version. For production, consider adding:
  - Proper error handling
  - Input validation
  - Rate limiting
  - Logging
  - Pagination for rides

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Socket.io Not Connecting
- Check CORS settings in `server.js`
- Ensure frontend and backend URLs match
- Check browser console for errors

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for simplicity and learning.

---

**Need Help?** Check the deployment steps above or open an issue on GitHub.
