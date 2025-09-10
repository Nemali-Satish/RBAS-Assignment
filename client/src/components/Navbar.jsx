import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Webhook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Webhook className="w-8 h-8 text-blue-400" />
                        <h1 className="text-xl font-bold text-gray-100">EduPortal</h1>
                    </div>

                    {/* User Info & Logout */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
                            <User className="w-5 h-5 text-gray-300" />
                            <span className="text-sm text-gray-100 font-medium">{user?.name}</span>
                            <span className="px-2 py-0.5 text-xs bg-blue-700 text-blue-200 rounded-full">
                                {user?.role}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
