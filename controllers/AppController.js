import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  // /status endpoint
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    return res.status(200).json(status);
  }

  // /stats endpoint
  static async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();

    const stats = {
      users,
      files,
    };
    return res.status(200).json(stats);
  }
}

export default AppController;
