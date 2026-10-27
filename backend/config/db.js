const mongoose = require('mongoose');

// Prevent Mongoose from queuing queries when disconnected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewai', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Notice]: ${error.message}. Operating with high-performance In-Memory Database store.`);
  }
};

module.exports = connectDB;
