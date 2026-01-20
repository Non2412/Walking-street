'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MarketAuthContext = createContext();

// ใช้ local API endpoint แทน market-api เพื่อหลีกเลี่ยง CORS issues
const API_BASE_URL = '/api';

export function MarketAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // โหลด token จาก localStorage เมื่อ app เริ่มต้น
    useEffect(() => {
        const savedToken = localStorage.getItem('market_token');
        const savedUser = localStorage.getItem('market_user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error loading auth:', error);
                localStorage.removeItem('market_token');
                localStorage.removeItem('market_user');
            }
        }
        setLoading(false);
    }, []);

    // User Signup
    const signup = async (username, email, password, fullName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, fullName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            const { token: newToken, user: newUser } = data.data;
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('market_token', newToken);
            localStorage.setItem('market_user', JSON.stringify(newUser));

            return { success: true, user: newUser };
        } catch (error) {
            console.error('❌ Signup failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    // User Login
    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            const { token: newToken, user: newUser } = data.data;
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('market_token', newToken);
            localStorage.setItem('market_user', JSON.stringify(newUser));

            return { success: true, user: newUser };
        } catch (error) {
            console.error('❌ Login failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    // Admin Login
    const adminLogin = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Admin login failed');
            }

            const { token: newToken, user: newUser } = data.data;
            setToken(newToken);
            setUser({ ...newUser, role: 'admin' });
            localStorage.setItem('market_token', newToken);
            localStorage.setItem('market_user', JSON.stringify({ ...newUser, role: 'admin' }));

            return { success: true, user: newUser };
        } catch (error) {
            console.error('❌ Admin login failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('market_token');
        localStorage.removeItem('market_user');
        router.push('/login');
    };

    return (
        <MarketAuthContext.Provider value={{
            user,
            token,
            loading,
            signup,
            login,
            adminLogin,
            logout,
            isAuthenticated: !!token,
        }}>
            {children}
        </MarketAuthContext.Provider>
    );
}

export function useMarketAuth() {
    const context = useContext(MarketAuthContext);
    if (!context) {
        throw new Error('useMarketAuth must be used within MarketAuthProvider');
    }
    return context;
}
