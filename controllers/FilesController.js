import { v4 as uuidv4 } from 'uuid';
import Queue from 'bull/lib/queue';
import { promisify } from 'util';
import { contentType } from 'mime-types';
import { promises as fs, stat, existsSync, realpath } from 'fs';
import { ObjectID } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const fileQueue = new Queue('thumbnail generation');

class FilesController {
  static async postUpload(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const userObjId = new ObjectID(userId);

    if (userId) {
      const users = dbClient.db.collection('users');
      const existingUser = await users.findOne({ _id: userObjId });

      if (!existingUser) {
        return response.status(401).json({ error: 'Unauthorized' });
      }

      const { name, type, data, parentId = 0, isPublic = false } = request.body;
      const allowedTypes = ['file', 'folder', 'image'];

      if (!name) {
        return response.status(400).json({ error: 'Missing name' });
      }

      if (!type || !allowedTypes.includes(type)) {
        return response.status(400).json({ error: 'Missing type' });
      }

      if (!data && type !== 'folder') {
        return response.status(400).json({ error: 'Missing data' });
      }

      const filesCollection = dbClient.db.collection('files');
      if (parentId) {
        const parentidObject = new ObjectID(parentId);
        const parentFile = await filesCollection.findOne({ _id: parentidObject, userId: existingUser._id });

        if (!parentFile) {
          return response.status(400).json({ error: 'Parent not found' });
        }

        if (parentFile.type !== 'folder') {
          return response.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      if (type === 'folder') {
        const inserted = await filesCollection.insertOne({
          userId: existingUser._id,
          name,
          type,
          isPublic,
          parentId,
        });
        const id = inserted.insertedId;
        return response.status(201).json({ id, userId, name, type, isPublic, parentId });
      }

      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const uuidstr = uuidv4();
      const filePath = `${folderPath}/${uuidstr}`;
      const buff = Buffer.from(data, 'base64');

      try {
        await fs.mkdir(folderPath, { recursive: true });
        await fs.writeFile(filePath, buff);
      } catch (error) {
        console.error(error);
      }

      const inserted = await filesCollection.insertOne({
        userId: existingUser._id,
        name,
        type,
        isPublic,
        parentId: parentId === 0 ? '0' : new ObjectID(parentId),
        localPath: filePath,
      });

      const fileId = inserted.insertedId;
      if (type === 'image') {
        const jobName = `Image thumbnail [${userId}-${fileId}]`;
        fileQueue.add({ userId, fileId, name: jobName });
      }

      return response.status(201).json({ id: fileId, userId, name, type, isPublic, parentId });
    } else {
      return response.status(401).json({ error: 'Unauthorized' });
    }
  }

  // Implement other methods (getShow, getIndex, putPublish, putUnPublish, getFile) similarly
}

export default FilesController;
