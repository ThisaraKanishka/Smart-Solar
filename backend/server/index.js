require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const seedDatabase = require('./seed');
const Customer = require('./models/Customer');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');
const packageRoutes = require('./routes/packages');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Smart Solar Energy Management System Backend',
    timestamp: new Date().toISOString(),
    dbMode: 'MongoDB Atlas'
  });
});

// Start Server
const startServer = async () => {
  try {
    await db.initDb();
    
    // Check if Customers collection in MongoDB Atlas is empty, if so auto-seed
    try {
      const custCount = await Customer.countDocuments();
      if (custCount === 0) {
        console.log('MongoDB collection empty, auto-seeding sample data...');
        await seedDatabase();
      }
    } catch (e) {
      console.log('Initial MongoDB check failed, seeding Atlas database...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`  Smart Solar Energy Backend running on port ${PORT}`);
      console.log(`  Database Mode: [MONGODB ATLAS EXCLUSIVE]`);
      console.log(`  Health check: http://localhost:${PORT}/api/health`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
