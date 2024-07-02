import redisClient from './utils/redis.js';

(async () => {
    // Check if Redis client is connected
    console.log(redisClient.isAlive());

    // Try to get a value that doesn't exist yet
    console.log(await redisClient.get('myKey')); // Should be null or undefined

    // Set a key with a value and an expiration time
    await redisClient.set(12, 'myKey', 5); // Corrected the order of arguments

    // Get the value of the key just set
    console.log(await redisClient.get('myKey')); // Should be '5'

    // Wait for 10 seconds and then check the value again
    setTimeout(async () => {
        console.log(await redisClient.get('myKey')); // Should be null after 12 seconds
    }, 1000 * 10);
})();
