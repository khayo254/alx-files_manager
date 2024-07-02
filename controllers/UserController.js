import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

const UserController = {
  async getMe(req, res) {
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

      // Retrieve user from MongoDB by userId
      const user = await dbClient.db.collection('users').findOne({ _id: userId });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Return user object (email and id only)
      return res.status(200).json({ email: user.email, id: user._id });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

export default UserController;
