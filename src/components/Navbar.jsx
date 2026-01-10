/**
 * Navbar Component - แถบเมนูด้านบน
 * ใช้สำหรับทุกหน้าหลังจาก Login
 */

'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { path: '/dashboard', label: 'หน้าหลัก', icon: '🏠' },
        { path: '/bookings', label: 'การจอง', icon: '📋' },
        { path: '/inventory', label: 'คลังสินค้า', icon: '📦' },
        { path: '/reports', label: 'รายงาน', icon: '📊' },
        { path: '/settings', label: 'ตั้งค่า', icon: '⚙️' },
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const isActive = (path) => pathname === path;

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                {/* Logo */}
                <div style={styles.logoSection} onClick={() => router.push('/dashboard')}>
                    <img
                        src="/img/walking.png"
                        alt="Logo"
                        style={styles.logo}
                    />
                    <span style={styles.logoText}>ตลาดถนนคนเดิน</span>
                </div>

                {/* Desktop Menu */}
                <div style={styles.menuDesktop}>
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            style={isActive(item.path) ? { ...styles.menuItem, ...styles.menuItemActive } : styles.menuItem}
                        >
                            <span style={styles.menuIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* User Menu */}
                <div style={styles.userSection}>
                    <div style={styles.userInfo}>
                        <span style={styles.userIcon}>👤</span>
                        <div style={styles.userDetails}>
                            <span style={styles.userName}>{user?.name}</span>
                            <span style={styles.userRole}>
                                {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        🚪 ออกจากระบบ
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    style={styles.mobileMenuButton}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div style={styles.mobileMenu}>
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                router.push(item.path);
                                setIsMobileMenuOpen(false);
                            }}
                            style={isActive(item.path) ? { ...styles.mobileMenuItem, ...styles.mobileMenuItemActive } : styles.mobileMenuItem}
                        >
                            <span style={styles.menuIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <button onClick={handleLogout} style={styles.mobileLogoutButton}>
                        🚪 ออกจากระบบ
                    </button>
                </div>
            )}
        </nav>
    );
}

const styles = {
    navbar: {
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    logo: {
        height: '40px',
        width: 'auto',
    },
    logoText: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#2c3e50',
        whiteSpace: 'nowrap',
    },
    menuDesktop: {
        display: 'flex',
        gap: '8px',
        flex: 1,
        justifyContent: 'center',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#7f8c8d',
        transition: 'all 0.3s',
        whiteSpace: 'nowrap',
    },
    menuItemActive: {
        backgroundColor: '#667eea',
        color: '#fff',
    },
    menuIcon: {
        fontSize: '18px',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    userIcon: {
        fontSize: '32px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '50%',
    },
    userDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    userName: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    userRole: {
        fontSize: '12px',
        color: '#7f8c8d',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
        whiteSpace: 'nowrap',
    },
    mobileMenuButton: {
        display: 'none',
        fontSize: '24px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
    },
    mobileMenu: {
        display: 'none',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
    },
    mobileMenuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#7f8c8d',
        textAlign: 'left',
        transition: 'all 0.3s',
    },
    mobileMenuItemActive: {
        backgroundColor: '#667eea',
        color: '#fff',
    },
    mobileLogoutButton: {
        padding: '12px 16px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '8px',
    },
};

// Media queries (จำลองด้วย JavaScript)
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const updateStyles = () => {
        if (mediaQuery.matches) {
            styles.menuDesktop.display = 'none';
            styles.userSection.display = 'none';
            styles.mobileMenuButton.display = 'block';
            styles.mobileMenu.display = 'flex';
        } else {
            styles.menuDesktop.display = 'flex';
            styles.userSection.display = 'flex';
            styles.mobileMenuButton.display = 'none';
        }
    };

    mediaQuery.addListener(updateStyles);
    updateStyles();
}
