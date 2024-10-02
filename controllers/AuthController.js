import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating tokens
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  // Method to connect (sign in) the user
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Decode the Base64 string
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    // Check if user exists
    const user = await dbClient.usersCollection.findOne({ email });
    if (!user || user.password !== sha1(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a random token
    const token = uuidv4();
    const key = `auth_${token}`;

    // Store the user ID in Redis for 24 hours
    await redisClient.set(key, user._id.toString(), 60 * 60 * 24);

    // Respond with the token
    return res.status(200).json({ token });
  }

  // Method to disconnect (sign out) the user
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete the token from Redis
    await redisClient.del(key);
    return res.status(204).send();
  }
}

export default AuthController;