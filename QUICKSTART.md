# 🚀 Quick Start Guide - RunARide

Get your RunARide app running in 5 minutes!

## Prerequisites
- Node.js installed (v14+)
- MongoDB installed locally OR MongoDB Atlas account

## Step 1: Install Dependencies
```bash
cd runaride
npm install
```

## Step 2: Setup Environment Variables
The `.env` file is already configured for local development. Just update if needed:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/runaride
JWT_SECRET=your_jwt_secret_key_change_in_production_123456
FRONTEND_URL=http://localhost:5000
```

## Step 3: Start MongoDB (if using local)
**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

## Step 4: Run the Application
```bash
npm run dev
```

## Step 5: Open in Browser
Navigate to: http://localhost:5000

## 🎉 That's it! Your app is running!

---

## Testing the App

### Create Test User:
1. Click "Sign Up"
2. Fill in the form
3. Click "Create Account"

### Create Test Driver:
1. Login with driver credentials (or create new account)
2. Go to Driver Dashboard: http://localhost:5000/driver-dashboard.html
3. Toggle "Available" to go online

### Book a Ride:
1. Login as user
2. Click "Book a Ride"
3. Enter pickup/drop locations
4. Click "Calculate Fare"
5. Click "Proceed to Book"

### Accept Ride (as Driver):
1. Keep driver dashboard open
2. When ride is booked, you'll see a notification
3. Click "Accept Ride"

---

## Common Issues

### "MongoDB connection error"
- Make sure MongoDB is running
- Check MONGODB_URI in .env file

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Cannot find module"
```bash
npm install
```

---

## Next Steps

1. **Deploy to Production**: See README.md for deployment guide
2. **Customize Styling**: Edit `style.css` and `auth.css`
3. **Add Features**: Extend the simple codebase as needed

---

**Need Help?** Check the full README.md or contact support.
