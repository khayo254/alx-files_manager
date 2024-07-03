// middlewares/AuthMiddleware.js

import jwt from 'jsonwebtoken';
import redisClient from '../utils/redis';

class AuthMiddleware {
  async authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized - Token expired or invalid' });
      }

      req.userId = userId;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  }
}

export default new AuthMiddleware();
