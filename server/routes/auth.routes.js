import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Register a new user
router.post('/register', authController.register);

// Log in an existing user
router.post('/login', authController.login);

// Get the currently logged-in user
router.get('/me', authenticate, authController.me);

export default router;

