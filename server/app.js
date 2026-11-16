import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth.routes.js';
import applicationRouter from './routes/application.routes.js';
import profileRouter from './routes/profile.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'JobTrail API is running',
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/profile', profileRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.message);

  res.status(err.statusCode || 500).json({
    error: {
      code: err.code || 'ERROR',
      message: err.message || 'Internal server error',
    },
  });
});

export default app;