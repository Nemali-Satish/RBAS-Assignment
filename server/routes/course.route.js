import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    unenrollFromCourse
} from '../controllers/course.controller.js';

const router = express.Router();

router.get('/', authenticateToken, getAllCourses);
router.post('/', authenticateToken, requireRole(['admin']), createCourse);
router.put('/:id', authenticateToken, requireRole(['admin']), updateCourse);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteCourse);
router.post('/:id/enroll', authenticateToken, requireRole(['student']), enrollInCourse);
router.post('/:id/unenroll', authenticateToken, requireRole(['student']), unenrollFromCourse);

export default router;
