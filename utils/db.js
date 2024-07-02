import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Define the DBClient class
class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url);
    this.client.connect()
      .then(() => {
        console.log('Connected successfully to MongoDB');
        this.db = this.client.db(database);
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB', err);
      });
  }

  isAlive() {
    return this.client.isConnected();
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

// Create and export an instance of the DBClient class
const dbClient = new DBClient();
export default dbClient;
