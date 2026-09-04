import mongoose from 'mongoose';
import { MONGODB_URL } from '../config/config';

/**
 * Mongo connection for serverless.
 *
 * The previous version checked `if (readyState)` and returned early. readyState
 * is a number — 0 disconnected, 1 connected, 2 connecting — so 2 passed as
 * truthy: a request arriving while the connection was still opening was told it
 * was connected and queried a socket that was not ready. On a cold start the
 * homepage fires seven requests at once, so one opened the connection and the
 * other six raced past it, got buffered by Mongoose, and failed 10 seconds
 * later on the default bufferTimeoutMS.
 *
 * The fix is to cache the connect *promise*, not a boolean: every concurrent
 * caller awaits the same one and none of them proceeds early.
 */

interface ConnectionCache {
  promise: Promise<typeof mongoose> | null;
}

// Kept on globalThis so a reused serverless instance — and dev hot reloads —
// reconnect once rather than on every invocation.
const globalForMongoose = globalThis as unknown as { _mongooseCache?: ConnectionCache };
const cache: ConnectionCache = globalForMongoose._mongooseCache ?? { promise: null };
globalForMongoose._mongooseCache = cache;

const _db = async () => {
  // Only 1 means connected. 2 is still opening and must be waited on.
  if (mongoose.connection.readyState === 1) return mongoose;

  if (!MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined in the environment');
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URL, {
        // Default is 30s, which leaves a request hanging far longer than any
        // caller is willing to wait for a database that is simply unreachable.
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .catch((error) => {
        // Never cache a rejected promise, or every later request inherits this
        // one failure for the life of the instance.
        cache.promise = null;
        throw error;
      });
  }

  await cache.promise;
  return mongoose;
};

export default _db;
