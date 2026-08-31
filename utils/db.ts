import mongoose from 'mongoose';
import { MONGODB_URL } from '../config/config';

const _db = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }

    if (!MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined in the environment');
    }

    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default _db;
