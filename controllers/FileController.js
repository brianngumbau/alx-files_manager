import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, type, parentId = 0, isPublic = false, data } = req.body;
    
    // Validation
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) return res.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });

    let parentFile = null;
    if (parentId !== 0) {
      parentFile = await dbClient.db.collection('files').findOne({ _id: dbClient.objectID(parentId) });
      if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
      if (parentFile.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }

    // Handle folder creation
    if (type === 'folder') {
      const newFolder = {
        userId: dbClient.objectID(userId),
        name,
        type,
        parentId: parentId || 0,
        isPublic,
      };
      const result = await dbClient.db.collection('files').insertOne(newFolder);
      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }

    // Handle file or image creation
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    await fs.mkdir(folderPath, { recursive: true });

    const localPath = path.join(folderPath, uuidv4());
    const fileBuffer = Buffer.from(data, 'base64');
    await fs.writeFile(localPath, fileBuffer);

    const newFile = {
      userId: dbClient.objectID(userId),
      name,
      type,
      isPublic,
      parentId: parentId || 0,
      localPath,
    };

    const result = await dbClient.db.collection('files').insertOne(newFile);

    return res.status(201).json({
      id: result.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }
}

export default FilesController;