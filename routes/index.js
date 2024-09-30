import { Router } from 'express';
import AppController from '../controllers/AppController';

const router = Router();

// Defining the /status endpoint
router.get('/status', AppController.getStatus);

// Defining the /stats endpoint
router.get('/stats', AppController.getStats);

export default router;
