import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, User, Mail, BookOpen, Calendar } from 'lucide-react';

const ProfileTab = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        course: user?.course || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (message) setMessage('');
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const result = await updateProfile(formData);

        if (result.success) {
            setMessage('Profile updated successfully!');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto text-gray-100">
            <div className="flex items-center space-x-3 mb-6">
                <User className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-xl font-semibold">My Profile</h2>
                    <p className="text-gray-400">Update your personal information</p>
                </div>
            </div>

            {message && (
                <div className="mb-4 p-3 bg-green-800 text-green-200 rounded-md text-sm">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-800 text-red-200 rounded-md text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm mb-1">
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>Full Name</span>
                        </div>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm mb-1">
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>Email Address</span>
                        </div>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="course" className="block text-sm mb-1">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span>Current Course</span>
                        </div>
                    </label>
                    <input
                        type="text"
                        id="course"
                        name="course"
                        value={formData.course}
                        disabled
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                </div>

                <div className="bg-gray-800 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2 flex items-center space-x-2 text-gray-200">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Account Information</span>
                    </h3>
                    <div className="space-y-1 text-sm text-gray-400">
                        <p><span className="font-medium text-gray-200">Role:</span> {user?.role}</p>
                        <p><span className="font-medium text-gray-200">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
                        <p><span className="font-medium text-gray-200">Enrolled courses:</span> {user?.enrolledCourses?.length || 0}</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Loading...' : <>
                        <Save className="w-4 h-4" />
                        <span>Update Profile</span>
                    </>}
                </button>
            </form>
        </div>
    );
};

export default ProfileTab;
