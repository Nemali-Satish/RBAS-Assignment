import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProfileTab from '../components/student/ProfileTab';
import CoursesTab from '../components/student/CoursesTab';
import ChangePasswordTab from '../components/student/ChangePasswordTab';
import { User, BookOpen, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/courses', {
                headers: {
                    Authorization: `Bearer ${token}`, // <-- add this
                },
            }); setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-100">Student Dashboard</h1>
                    <p className="mt-2 text-gray-400">Manage your profile and explore courses</p>
                </div>

                {/* Tabs */}
                <div className="bg-gray-800 rounded-lg">
                    <div className="border-b border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    } transition-colors`}
                            >
                                <User className="w-4 h-4" />
                                <span>My Profile</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses'
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    } transition-colors`}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Available Courses</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'password'
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    } transition-colors`}
                            >
                                <Lock className="w-4 h-4" />
                                <span>Change Password</span>
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'profile' && <ProfileTab />}
                        {activeTab === 'courses' && (
                            <CoursesTab courses={courses} onCoursesChange={fetchCourses} />
                        )}
                        {activeTab === 'password' && <ChangePasswordTab />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
