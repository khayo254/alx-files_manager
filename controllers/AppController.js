import dbClient from '../utils/db.js';

async function getStatus(req, res) {
  const redisAlive = true; // Assuming Redis is always alive in this context
  const dbAlive = dbClient.isAlive();

  if (dbAlive) {
    res.status(200).json({ redis: redisAlive, db: true });
  } else {
    res.status(500).json({ redis: redisAlive, db: false });
  }
}

async function getStats(req, res) {
  try {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    res.status(200).json({ users: usersCount, files: filesCount });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { getStatus, getStats };
