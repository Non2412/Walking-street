/**
 * Auth Context - จัดการ Authentication State
 * ใช้ local API routes (fallback from market-api)
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { userLogin, userSignup } from '@/services/api';
// import Script from 'next/script'; // Import Script for CDN loading

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // โหลด user จาก localStorage เมื่อ app เริ่มต้น
    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (savedUser && token && savedUser !== 'undefined' && savedUser !== 'null') {
                    try {
                        const parsedUser = JSON.parse(savedUser);
                        if (parsedUser) {
                            setUser(parsedUser);
                        }
                    } catch (e) {
                        console.error('Invalid JSON in localStorage, clearing...', e);
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                    }
                } else if (savedUser === 'undefined' || savedUser === 'null') {
                    // Clean up bad data
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login - ผ่าน Proxy API (แก้ปัญหา CORS)
    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login via Proxy...');

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.error || 'Login failed');
            }

            console.log('✅ Login successful', resData);

            // API sends { success: true, data: { user: ..., token: ... } }
            // Support both structures
            const { user, token } = resData.data || resData;

            if (!user || !token) {
                throw new Error('Invalid response from server');
            }

            // บันทึก user และ token
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            return { success: true, user: user };
        } catch (error) {
            console.error('❌ Login failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    // Register - ผ่าน Proxy API (แก้ปัญหา CORS)
    const register = async (userData) => {
        try {
            console.log('📝 Attempting registration via Proxy...');

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.error || 'Registration failed');
            }

            console.log('✅ Registration successful');

            const { user, token } = resData.data || resData;

            // บันทึก user และ token
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            return { success: true, user: user };
        } catch (error) {
            console.error('❌ Registration failed:', error.message);
            // Must return error for UI to show
            return { success: false, error: error.message };
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    // Reset Password
    const resetPassword = async (email) => {
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Reset password failed');
            }

            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Update User Profile
    const updateProfile = async (updates) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Update failed');
            }

            // อัพเดท user state
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom Hook
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}

export default AuthContext;
