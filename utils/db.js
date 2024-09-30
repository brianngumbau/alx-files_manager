// import { MongoClient } from 'mongodb';
import pkg from 'mongodb';

const { MongoClient } = pkg;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for performing operations with Mongo service
 */
class DBClient {
  constructor() {
    // Use async/await to properly handle MongoDB connection
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected successfully to MongoDB');
      this.db = this.client.db(DB_DATABASE);
      this.usersCollection = this.db.collection('users');
      this.filesCollection = this.db.collection('files');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.db = null; // Set db to null if there's a connection error
    }
  }

  /**
   * Checks if connection to MongoDB is alive
   * @return {boolean} true if connection is alive or false if not
   */
  isAlive() {
    return Boolean(this.db); // Check if db is set
  }

  /**
   * Returns the number of documents in the collection users
   * @return {Promise<number>} amount of users
   */
  async nbUsers() {
    try {
      const numberOfUsers = await this.usersCollection.countDocuments();
      return numberOfUsers;
    } catch (error) {
      console.error('Error fetching user count:', error);
      return 0;
    }
  }

  /**
   * Returns the number of documents in the collection files
   * @return {Promise<number>} amount of files
   */
  async nbFiles() {
    try {
      const numberOfFiles = await this.filesCollection.countDocuments();
      return numberOfFiles;
    } catch (error) {
      console.error('Error fetching file count:', error);
      return 0;
    }
  }
}

// Export a single instance of the DBClient
const dbClient = new DBClient();
export default dbClient;
