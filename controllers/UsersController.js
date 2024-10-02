import sha1 from 'sha1';
import dbClient from '../utils/db';

/**
 * UsersController for handling user-related requests
 */
class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // checking if user already exists
    const existingUser = await dbClient.usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // hashing the password with SHA1
    const hashedPassword = sha1(password);

    // inserting new user into the users collection
    const result = await dbClient.usersCollection.insertOne({
      email,
      password: hashedPassword,
    });

    // respond with users id and email
    const userId = result.insertedId;
    return res.status(201).json({ id: userId, email });
  }
}

export default UsersController;
