import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = Router();

// Defining the /status endpoint
router.get('/status', AppController.getStatus);

// Defining the /stats endpoint
router.get('/stats', AppController.getStats);

// Defining the POST /users endpoint
router.post('/users', UsersController.postNew);
export default router;
