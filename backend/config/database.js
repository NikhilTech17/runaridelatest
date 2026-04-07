const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    console.log("Mongo URI:", uri ? "Loaded ✓" : "Not found ✗");

    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;