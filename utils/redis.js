import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.client.on('error', (err) => console.error('Redis Client Error', err));
        
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.expireAsync = promisify(this.client.expire).bind(this.client);
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        const value = await this.getAsync(key);
        return value;
    }

    async set(key, value, duration) {
        await this.setAsync(key, value);
        await this.expireAsync(key, duration);
    }
}

const redisClient = new RedisClient();
export default redisClient;
