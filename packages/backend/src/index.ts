import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';
import { trackRequestMetrics } from './lib/requestMetrics';
import { rateLimit } from './lib/rateLimit';

const app = express();
const port = process.env.PORT || 3001; // Default to 3001 if PORT is not set

// Middleware to parse JSON bodies
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());
app.use(rateLimit);
app.use(trackRequestMetrics);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('mktdash Backend is running!');
});

// Use API routes
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`mktdash Backend listening at http://localhost:${port}`);
});