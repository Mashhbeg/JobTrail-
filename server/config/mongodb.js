import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Use Google DNS to resolve MongoDB Atlas SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4']);

let mongoConnection = null;

export async function connectMongoDB() {
  if (mongoConnection) {
    return mongoConnection;
  }

  try {
    mongoConnection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✓ MongoDB connected successfully');
    return mongoConnection;
  } catch (error) {
    mongoConnection = null;
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
}

export async function disconnectMongoDB() {
  if (mongoConnection) {
    await mongoose.disconnect();
    mongoConnection = null;
  }
}

