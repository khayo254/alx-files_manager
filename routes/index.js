import express from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UserController.js';
import AuthController from '../controllers/AuthController.js';
import UserController from '../controller/UserController.js';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);

export default router;
