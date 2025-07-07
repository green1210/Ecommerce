import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection for authentication only
let db;
let client;

async function connectToDatabase() {
  // Skip MongoDB connection if explicitly disabled
  if (process.env.SKIP_MONGODB === 'true') {
    console.log('Skipping MongoDB connection (disabled via SKIP_MONGODB)');
    return;
  }

  // Check if MONGODB_URI is defined
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI not defined, using fallback authentication');
    return;
  }

  try {
    console.log('Connecting to MongoDB for authentication...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || 'zenlify');
    console.log(' Connected to MongoDB successfully');
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log(' Database indexes created');
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    console.log(' Continuing with fallback authentication (in-memory)');
    // Don't throw error, continue with fallback
  }
}

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zenlify API Server',
    status: 'Running',
    version: '1.0.0',
    database: db ? 'MongoDB Connected' : 'Fallback Mode'
  });
});

// API root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Zenlify API',
    database: db ? 'MongoDB Connected' : 'Fallback Mode',
    endpoints: {
      auth: '/api/auth (MongoDB)',
      products: '/api/products (External API)',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: {
      mongodb: db ? 'Connected' : 'Not connected (using fallback)',
      status: db ? 'healthy' : 'fallback'
    },
    services: {
      authentication: db ? 'MongoDB' : 'In-memory fallback',
      products: 'External API (FakeStore)'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler - must be last
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` API docs: http://localhost:${PORT}/api`);
    console.log(` Authentication: ${db ? 'MongoDB' : 'Fallback mode'}`);
    console.log(` Products: External API (FakeStore)`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
