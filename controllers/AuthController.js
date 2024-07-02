import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import sha1 from 'sha1';

const AuthController = {
  async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract credentials from Authorization header
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    // Hash the password to match stored SHA1 hash
    const hashedPassword = sha1(password);

    try {
      // Find user in MongoDB by email and hashed password
      const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate token and store in Redis
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, user._id.toString(), 'EX', 24 * 60 * 60); // Store for 24 hours

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error during authentication:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    try {
      // Check if token exists in Redis
      const userId = await redisClient.get(key);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete token from Redis
      await redisClient.del(key);
      return res.status(204).send();
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

export default AuthController;
