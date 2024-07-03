import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect();
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, exp) {
    await this.client.set(key, value);
    if (exp) {
      await this.client.expire(key, exp);
    }
  }

  async del(key) {
    return this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
