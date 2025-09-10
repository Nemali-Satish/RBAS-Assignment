import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StudentsTab from '../components/admin/StudentsTab';
import CoursesTab from '../components/admin/CoursesTab';
import { Users, BookOpen, BarChart3 } from 'lucide-react';


const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalEnrollments: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentsRes, coursesRes] = await Promise.all([
                axios.get(`${API_URL}/users/students`),
                axios.get(`${API_URL}/courses`),
            ]);

            setStudents(studentsRes.data.students);
            setCourses(coursesRes.data.courses);

            const totalEnrollments = studentsRes.data.students.reduce(
                (acc, student) => acc + student.enrolledCourses.length,
                0
            );

            setStats({
                totalStudents: studentsRes.data.students.length,
                totalCourses: coursesRes.data.courses.length,
                totalEnrollments,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <Navbar />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-300">Manage students and courses</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <Users className="w-10 h-10 text-blue-400" />
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                                <p className="text-gray-300">Total Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <BookOpen className="w-10 h-10 text-green-400" />
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
                                <p className="text-gray-300">Total Courses</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <BarChart3 className="w-10 h-10 text-purple-400" />
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-white">{stats.totalEnrollments}</p>
                                <p className="text-gray-300">Total Enrollments</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-gray-800 rounded-lg shadow-md">
                    <div className="border-b border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('students')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students'
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                                    } transition-colors`}
                            >
                                Students Management
                            </button>
                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses'
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                                    } transition-colors`}
                            >
                                Courses Management
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'students' && (
                            <StudentsTab students={students} onStudentsChange={fetchData} darkTheme />
                        )}
                        {activeTab === 'courses' && (
                            <CoursesTab courses={courses} onCoursesChange={fetchData} darkTheme />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
