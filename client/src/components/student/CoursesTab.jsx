import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Search, BookOpen, User, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const CoursesTab = ({ courses, onCoursesChange }) => {
  const { user, refreshUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  const isEnrolled = (courseId) =>
    user?.enrolledCourses?.some(
      (enrollment) => enrollment.courseId._id === courseId || enrollment.courseId === courseId
    );

  const handleEnroll = async (courseId) => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`);
      await refreshUser();
      setMessage('Successfully enrolled in the course!');
      onCoursesChange();
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setLoading(false);

    }
  };

  const handleUnenroll = async (courseId) => {
    if (!confirm('Are you sure you want to unenroll from this course?')) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');

      await axios.post(`http://localhost:5000/api/courses/${courseId}/unenroll`);
      await refreshUser();
      setMessage('Successfully unenrolled from the course!');
      onCoursesChange();
    } catch (err) {
      setError(err.response?.data?.message || 'Unenrollment failed');
    } finally {
      await refreshUser();
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Available Courses</h2>
          <p className="text-gray-400">Discover and enroll in courses</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-900 text-green-200 rounded-md text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="bg-gray-800 rounded-lg p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-100 flex-1">{course.title}</h3>
              {isEnrolled(course._id) && (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 ml-2" />
              )}
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{course.description}</p>

            <div className="space-y-2 mb-4 text-gray-300 text-sm">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${course.level === 'Beginner'
                    ? 'bg-green-900 text-green-400'
                    : course.level === 'Intermediate'
                      ? 'bg-yellow-900 text-yellow-400'
                      : 'bg-red-900 text-red-400'
                    }`}
                >
                  {course.level}
                </span>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-semibold text-blue-400">{course.price}</span>
                </div>
              </div>
              <p>
                <span className="font-medium text-gray-100">Enrolled:</span>{' '}
                {course.enrolledStudents?.length || 0} students
              </p>
            </div>

            {isEnrolled(course._id) ? (
              <button
                onClick={() => handleUnenroll(course._id)}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Unenroll</span>
              </button>
            ) : (
              <button
                onClick={() => handleEnroll(course._id)}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Enroll Now</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">No courses found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
