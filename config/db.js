const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS querySrv issues
if (process.platform === 'win32') {
  try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.log('DNS config warning:', err.message);
  }
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

const connectDB = async () => {
  const dbUri = process.env.DATABASE || process.env.MONGODB_URI;
  if (!dbUri) {
    throw new Error('DATABASE or MONGODB_URI environment variable is missing');
  }

  await mongoose.connect(dbUri);
  console.log('Database connection established');
};

module.exports = connectDB;
