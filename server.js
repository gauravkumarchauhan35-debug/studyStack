require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Starting server in offline/disconnected mode...');
  }
  
  app.listen(PORT, () => {
    console.log(`Express server is live on port ${PORT}`);
  });
};

startServer();
