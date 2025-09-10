import User from '../models/User.js';

// Get all students (Admin only)
export const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password')
            .populate('enrolledCourses.courseId')
            .sort({ createdAt: -1 });

        res.json({ students });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update current user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, course } = req.body;
        const userId = req.user._id;

        // Check if email is already taken by another user
        if (email !== req.user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already taken' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, course },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete student (Admin only)
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'Student not found' });
        if (user.role !== 'student') {
            return res.status(400).json({ message: 'Cannot delete non-student users' });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update student (Admin only)
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, course } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'Student not found' });
        if (user.role !== 'student') {
            return res.status(400).json({ message: 'Cannot update non-student users' });
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already taken' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, course },
            { new: true }
        ).select('-password');

        res.json({ message: 'Student updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
