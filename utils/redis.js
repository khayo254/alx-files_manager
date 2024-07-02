import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Redis class implementation
 */ 
class RedisClient {
    /**
     * Constructor that creates a client to Redis
     */
    constructor() {
        this.client = createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);

        this.client.on('error', (error) => {
            console.log(`Redis client is not connected to the server: ${error.message}`);
        });

        this.client.on('connect', () => {
            // successful connection
        });
    }

    /**
     * Check if the connection to Redis is a success
     * 
     * @returns {boolean} True if connected
     */
    isAlive() {
        return this.client.connected;
    }

    /**
     * Get the value stored for a key
     *
     * @param {string} key - The key to search for
     * @returns {Promise<string>} - The value stored for the key
     */
    async get(key) {
        const redisGet = promisify(this.client.get).bind(this.client);
        const value = await redisGet(key);
        return value;
    }

    /**
     * Set a value for a key with an expiration time
     *
     * @param {number} time - The time to live for the key
     * @param {string} key - The key to set
     * @param {string} value - The value to set
     */
    async set(time, key, value) {
        const redisSet = promisify(this.client.set).bind(this.client);
        await redisSet(key, value);
        await this.client.expire(key, time);
    }

    /**
     * Delete a key
     * 
     * @param {string} key - The key to delete
     */
    async del(key) {
        const redisDel = promisify(this.client.del).bind(this.client);
        await redisDel(key);
    }
}

const redisClient = new RedisClient();

export default redisClient;
