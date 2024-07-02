import express from 'express';
const router = express.Router();

import { getStatus, getStats } from '../controllers/AppController.js';

// Status endpoint
router.get('/status', getStatus);

// Stats endpoint
router.get('/stats', getStats);

export default router;
