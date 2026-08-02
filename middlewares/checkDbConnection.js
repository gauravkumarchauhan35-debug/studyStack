const mongoose = require('mongoose');

const checkDbConnection = (req, res, next) => {
  // 1 = Connected, 2 = Connecting, 0 = Disconnected, 3 = Disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database is not connected. Please whitelist Render IP (0.0.0.0/0) in MongoDB Atlas and verify DATABASE environment variable on Render.'
    });
  }
  next();
};

module.exports = checkDbConnection;
