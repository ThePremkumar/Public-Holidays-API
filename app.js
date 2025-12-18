import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import holidayRoutes from './routes/holidays.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/holidays', holidayRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
