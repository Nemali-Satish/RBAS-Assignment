import Course from '../models/Course.js';
import User from '../models/User.js';

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('createdBy', 'name email')
            .populate('enrolledStudents', 'name email')
            .sort({ createdAt: -1 });

        res.json({ courses });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create course (Admin only)
export const createCourse = async (req, res) => {
    try {
        const { title, description, instructor, duration, level, price } = req.body;

        const course = new Course({
            title,
            description,
            instructor,
            duration,
            level,
            price,
            createdBy: req.user._id
        });

        await course.save();
        await course.populate('createdBy', 'name email');

        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update course (Admin only)
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, instructor, duration, level, price } = req.body;

        const course = await Course.findByIdAndUpdate(
            id,
            { title, description, instructor, duration, level, price },
            { new: true }
        ).populate('createdBy', 'name email');

        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete course (Admin only)
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndDelete(id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Remove course from enrolled students
        await User.updateMany(
            { 'enrolledCourses.courseId': id },
            { $pull: { enrolledCourses: { courseId: id } } }
        );

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Enroll in course (Student only)
export const enrollInCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const user = await User.findById(userId);

        // Check if already enrolled
        const alreadyEnrolled = user.enrolledCourses.some(
            enrollment => enrollment.courseId.toString() === id
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Add to user's enrolled courses
        user.enrolledCourses.push({ courseId: id });
        await user.save();

        // Add user to course's enrolled students
        course.enrolledStudents.push(userId);
        await course.save();

        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Unenroll from course (Student only)
export const unenrollFromCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        await User.findByIdAndUpdate(
            userId,
            { $pull: { enrolledCourses: { courseId: id } } }
        );

        await Course.findByIdAndUpdate(
            id,
            { $pull: { enrolledStudents: userId } }
        );

        res.json({ message: 'Successfully unenrolled from course' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
