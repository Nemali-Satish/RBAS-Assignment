import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Edit, Search, Plus, X, Save } from 'lucide-react';

const StudentsTab = ({ students, onStudentsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.course || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (student) => {
    setEditingStudent(student._id);
    setEditForm({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    setError('');
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/users/students/${editingStudent}`, editForm);
      setEditingStudent(null);
      setEditForm({});
      onStudentsChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditForm({});
    setError('');
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/users/students/${studentId}`);
      onStudentsChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Students Management</h2>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {['Student', 'Email', 'Course', 'Enrolled Courses', 'Joined', 'Actions'].map((title) => (
                <th
                  key={title}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStudent === student._id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-100">{student.name}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStudent === student._id ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-100">{student.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStudent === student._id ? (
                    <input
                      type="text"
                      value={editForm.course}
                      onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                      className="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-100">{student.course || 'Not specified'}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-100">
                    {student.enrolledCourses?.length || 0} courses
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingStudent === student._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={loading}
                        className="text-green-400 hover:text-green-200 disabled:opacity-50"
                      >
                        {loading ? <p>Loading...</p> : <Save className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-400 hover:text-indigo-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-200 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No students found.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsTab;
