import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    setAuthToken,
    loginApi,
    registerApi,
    getCurrentUserApi,
    updateProfileApi,
    changePasswordApi,
} from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        setAuthToken(token || null);
    }, [token]);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await getCurrentUserApi();
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await loginApi(email, password);
            const { token: newToken } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Fetch current user immediately
            const currentUser = await getCurrentUserApi();
            setUser(currentUser.data.user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role = 'student') => {
        try {
            const response = await registerApi(name, email, password, role);
            const { token: newToken, user: userData } = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setAuthToken(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await updateProfileApi(profileData);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Profile update failed' };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            await changePasswordApi(currentPassword, newPassword);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Password change failed' };
        }
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const response = await getCurrentUserApi();
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};
