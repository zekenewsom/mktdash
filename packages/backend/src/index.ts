import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import apiRoutes from './routes/api';

const app = express();
const port = process.env.PORT || 3001; // Default to 3001 if PORT is not set

// Middleware to parse JSON bodies
app.use(express.json());

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