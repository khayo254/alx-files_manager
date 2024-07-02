import dotenv from 'dotenv';
dotenv.config();

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.client = null;
    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      // Dynamically import MongoClient as a CommonJS module
      const { MongoClient } = await import('mongodb');
      this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      await this.client.connect();
      this.db = this.client.db(database);
      console.log('Connected successfully to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      throw err;
    }
  }

  isAlive() {
    return this.client && this.client.isConnected();
  }

  async nbUsers() {
    try {
      return await this.db.collection('users').countDocuments();
    } catch (err) {
      console.error('Failed to count users', err);
      return 0;
    }
  }

  async nbFiles() {
    try {
      return await this.db.collection('files').countDocuments();
    } catch (err) {
      console.error('Failed to count files', err);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
