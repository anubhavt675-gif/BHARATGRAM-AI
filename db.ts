
import mongoose from 'mongoose';

/**
 * Production-ready Database Connection logic.
 * Ensures the app connects to MongoDB with optimized settings.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bharatgram');
    console.log(`🇮🇳 Bharatgram DB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
