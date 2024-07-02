import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisClient {
  constructor() {
    // Create a new Redis client instance
    this.client = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    });

    // Handle errors
    this.client.on('error', (err) => {
      console.error('Redis client error', err);
    });

    // Redis client does not need to explicitly connect in newer versions

    // Optionally, you can check for ready state
    this.client.on('ready', () => {
      console.log('Redis client connected and ready');
    });

    // Optionally, you can check for end state
    this.client.on('end', () => {
      console.log('Redis client connection closed');
    });
  }

  // Method to check if the client is connected to Redis
  isAlive() {
    return this.client.connected;
  }

  // Asynchronous method to get a value from Redis
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Failed to get key from Redis', err);
      return null;
    }
  }

  // Asynchronous method to set a value in Redis
  async set(key, value, expiration) {
    try {
      await this.client.set(key, value);
      if (expiration) {
        await this.client.expire(key, expiration);
      }
    } catch (err) {
      console.error('Failed to set key in Redis', err);
    }
  }
}

// Create and export an instance of the RedisClient class
const redisClient = new RedisClient();
export default redisClient;
