const mongoose = require('mongoose');
const dns = require('dns');

// Configure Node.js DNS resolver to use Google & Cloudflare DNS for MongoDB SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('Custom DNS setServers warning:', e.message);
}

const initDb = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in backend/server/.env');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000, // 15 seconds timeout
      connectTimeoutMS: 15000
    });
    console.log('=================================================');
    console.log('✓ Successfully connected to MongoDB Atlas!');
    console.log('=================================================');
  } catch (err) {
    console.error('MongoDB Atlas Connection Error:', err.message);
    throw err;
  }
};

module.exports = {
  initDb,
  getDbMode: () => 'mongodb'
};
