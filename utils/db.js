import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}`, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.db = this.client.db(database);
      console.log('Connected to MongoDB');
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
    });
  }
}

const dbClient = new DBClient();
export default dbClient;
