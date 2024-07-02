const { MongoClient } = require('mongodb');
require('dotenv').config();

// Define the DBClient class
class DBClient {
  constructor() {
    // Get MongoDB connection details from environment variables or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    // Create a new MongoClient instance and connect to the database
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect((err) => {
      if (err) {
        // Log an error message if the connection fails
        console.error('Failed to connect to MongoDB', err);
      } else {
        // Log a success message if the connection is successful
        console.log('Connected successfully to MongoDB');
      }
    });
    // Store a reference to the database
    this.db = this.client.db(database);
  }

  // Method to check if the client is connected to MongoDB
  isAlive() {
    return this.client.isConnected();
  }

  // Asynchronous method to count the number of documents in the 'users' collection
  async nbUsers() {
    try {
      return await this.db.collection('users').countDocuments();
    } catch (err) {
      // Log an error message if counting documents fails
      console.error('Failed to count users', err);
      return 0;
    }
  }

  // Asynchronous method to count the number of documents in the 'files' collection
  async nbFiles() {
    try {
      return await this.db.collection('files').countDocuments();
    } catch (err) {
      // Log an error message if counting documents fails
      console.error('Failed to count files', err);
      return 0;
    }
  }
}

// Create and export an instance of the DBClient class
const dbClient = new DBClient();
module.exports = dbClient;
