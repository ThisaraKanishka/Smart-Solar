const mongoose = require('mongoose');

const initDb = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in backend/server/.env');
  }

  try {
    await mongoose.connect(mongoUri);
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
