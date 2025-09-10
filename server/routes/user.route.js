import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    getAllStudents,
    updateProfile,
    deleteStudent,
    updateStudent
} from '../controllers/student.controller.js';

const router = express.Router();

// Admin routes
router.get('/students', authenticateToken, requireRole(['admin']), getAllStudents);
router.delete('/students/:id', authenticateToken, requireRole(['admin']), deleteStudent);
router.put('/students/:id', authenticateToken, requireRole(['admin']), updateStudent);

// Current user profile
router.put('/profile', authenticateToken, updateProfile);

export default router;
