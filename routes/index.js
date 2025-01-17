import express from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UserController.js';
import AuthController from '../controllers/AuthController.js';
import UserController from '../controller/UserController.js';
import FilesController from '../controllers/FilesController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);
router.post('/files', AuthMiddleware.authenticateToken, FilesController.postUpload);
router.post('/files, FilesController.postUpload');
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnPublish);
router.get('/files/:id/data', FilesController.getFile);

export default router;
