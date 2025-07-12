// lib/adminDbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI_ADMIN = process.env.MONGODB_URI_ADMIN;

if (!MONGODB_URI_ADMIN) {
  throw new Error(
    'Please define the MONGODB_URI_ADMIN environment variable inside .env.local for the admin project.'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially during API Route usage.
 */
let cached = global.mongooseAdmin;

if (!cached) {
  cached = global.mongooseAdmin = { conn: null, promise: null };
}

async function adminDbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI_ADMIN, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default adminDbConnect;