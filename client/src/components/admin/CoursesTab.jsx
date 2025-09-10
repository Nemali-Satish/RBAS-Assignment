import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, X, Save, Search } from 'lucide-react';

const CoursesTab = ({ courses, onCoursesChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'Beginner',
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      level: 'Beginner',
      price: 0,
    });
    setError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/courses', courseForm);
      setShowCreateForm(false);
      resetForm();
      onCoursesChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Course creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course._id);
    setCourseForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level,
      price: course.price,
    });
    setError('');
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/courses/${editingCourse}`, courseForm);
      setEditingCourse(null);
      resetForm();
      onCoursesChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Course update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    resetForm();
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
      onCoursesChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Course deletion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Courses Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Create Course Form */}
      {showCreateForm && (
        <div className="mb-6 p-6 bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Create New Course</h3>
            <button
              onClick={() => {
                setShowCreateForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Instructor"
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                className="px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Duration (e.g., 4 weeks)"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                className="px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                className="px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                value={courseForm.price}
                onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) })}
                className="px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <textarea
              placeholder="Course Description"
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? <p>Loading...</p> : <Save className="w-4 h-4" />}
              <span>Create Course</span>
            </button>
          </form>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course._id} className="bg-gray-900 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {editingCourse === course._id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded text-lg font-bold"
                />
                <input
                  type="text"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  className="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded"
                />
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="px-2 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded text-sm"
                  />
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="px-2 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <input
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) })}
                  className="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded"
                  step="0.01"
                />
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? <p>Loading...</p> : <Save className="w-4 h-4" />}
                    <span className="text-sm">Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">{course.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Instructor:</span> {course.instructor}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Duration:</span> {course.duration}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${course.level === 'Beginner'
                          ? 'bg-green-800 text-green-100'
                          : course.level === 'Intermediate'
                            ? 'bg-yellow-800 text-yellow-100'
                            : 'bg-red-800 text-red-100'
                        }`}
                    >
                      {course.level}
                    </span>
                    <span className="text-lg font-bold text-blue-400">${course.price}</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Enrolled:</span> {course.enrolledStudents?.length || 0} students
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No courses found.
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
