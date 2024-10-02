import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = Router();

// Defining the /status endpoint
router.get('/status', AppController.getStatus);

// Defining the /stats endpoint
router.get('/stats', AppController.getStats);

// Defining the /connect endpoint
router.get('/connect', AuthController.getConnect);

// Defining the /disconnect endpoint
router.get('disconnect', AuthController.getDisconnect);

// Defining the /users/me endpoint
router.get('/users/me', UsersController.getMe);

router.get('/files/:id', FilesController.getShow);

//  route for getting file content
router.get('/files/:id/data', FilesController.getFile);

router.get('/files', FilesController.getIndex);
// Defining the POST /users endpoint
router.post('/users', UsersController.postNew);

// Defining the POST /files endpoint
router.post('/files', FilesController.postUpload);

router.put('/files/:id/publish', FilesController.putPublish);

router.put('/files/:id/unpublish', FilesController.putUnpublish);

export default router;
