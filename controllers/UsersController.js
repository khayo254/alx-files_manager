import { ObjectId } from 'mongodb';
import dbClient from '../utils/db.js';
import sha1 from 'sha1';

class UsersController {
  async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email or password are missing
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if email already exists
      const userExists = await dbClient.db.collection('users').findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exists' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Insert new user into the database
      const result = await dbClient.db.collection('users').insertOne({
        email,
        password: hashedPassword,
      });

      // Return the newly created user with email and id
      const newUser = {
        id: result.insertedId,
        email,
      };

      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

const usersController = new UsersController();
export default usersController;
