import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    registerUser,
    loginUser,
    getCurrentUser,
    changePassword
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/change-password', authenticateToken, changePassword);

export default router;
