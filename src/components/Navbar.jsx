
/**
 * Navbar Component - แถบเมนูด้านบน
 * ใช้สำหรับทุกหน้าหลังจาก Login
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 'welcome', text: 'ยินดีต้อนรับสู่ตลาดถนนคนเดิน!', time: 'ตอนนี้', unread: true }
    ]);

    // Fetch notifications based on bookings
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/bookings');
                const data = await res.json();

                if (data.success) {
                    // Filter user bookings
                    const myBookings = data.data
                        .filter(b => b.email === user.email)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

                    const newNotifications = [];

                    // Welcome msg
                    newNotifications.push({
                        id: 'welcome',
                        text: `ยินดีต้อนรับคุณ ${user.name}! เริ่มต้นการจองพื้นที่ได้เลย`,
                        time: 'ตอนนี้',
                        unread: false
                    });

                    // Booking updates
                    myBookings.forEach(booking => {
                        if (booking.status === 'pending') {
                            newNotifications.push({
                                id: `${booking.id}-pending`,
                                text: `⏳ การจองบูธ (จำนวน ${booking.booths ? booking.booths.length : 1} บูธ) กำลังรอตรวจสอบ`,
                                time: new Date(booking.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                                unread: true
                            });
                        } else if (booking.status === 'waiting_for_payment') {
                            newNotifications.push({
                                id: `${booking.id}-pay`,
                                text: `🔴 การจองของคุณยังไม่เสร็จสมบูรณ์! กรุณาชำระเงินทันทีเพื่อรักษาสิทธิ์`,
                                time: new Date(booking.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                                unread: true,
                                style: { borderLeft: '3px solid #e74c3c', backgroundColor: '#fff5f5' },
                                actionLink: `/bookings?paymentId=${booking.id}`
                            });
                        } else if (booking.status === 'approved') {
                            newNotifications.push({
                                id: `${booking.id}-approved`,
                                text: `✅ ยินดีด้วย! การจองบูธของคุณได้รับการอนุมัติแล้ว`,
                                time: new Date(booking.updatedAt || booking.createdAt).toLocaleDateString('th-TH'),
                                unread: true,
                                style: { borderLeft: '3px solid #2ecc71' }
                            });
                        } else if (booking.status === 'rejected') {
                            newNotifications.push({
                                id: `${booking.id}-rejected`,
                                text: `❌ การจองบูธของคุณไม่ผ่านการอนุมัติ`,
                                time: new Date(booking.updatedAt || booking.createdAt).toLocaleDateString('th-TH'),
                                unread: true,
                                style: { borderLeft: '3px solid #e74c3c' }
                            });
                        }
                    });

                    setNotifications(newNotifications);
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();

        const interval = setInterval(fetchNotifications, 10000); // Check every 10s
        return () => clearInterval(interval);

    }, [user]);

    const menuItems = [
        { path: '/bookings', label: 'หน้าหลัก', icon: '🏠' },
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleNotificationClick = (n) => {
        if (n.actionLink) {
            router.push(n.actionLink);
            setShowNotifications(false);
        }
    };

    const isActive = (path) => pathname === path;

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                {/* Logo */}
                <div style={styles.logoSection} onClick={() => router.push('/bookings')}>
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

                {/* Right Section: Notifications + User */}
                <div style={styles.userSection}>

                    {/* Notification Bell */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={styles.notificationBtn}
                        >
                            🔔
                            {notifications.some(n => n.unread) && <span style={styles.notificationBadge}></span>}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div style={styles.notificationDropdown}>
                                <div style={styles.notificationHeader}>การแจ้งเตือน</div>
                                <div style={styles.notificationList}>
                                    {notifications.map(n => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleNotificationClick(n)}
                                            style={{
                                                ...styles.notificationItem,
                                                backgroundColor: n.unread ? '#f9f9ff' : '#fff',
                                                ...(n.style || {})
                                            }}
                                        >
                                            <div style={styles.notificationText}>{n.text}</div>
                                            <div style={styles.notificationTime}>{n.time}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.notificationFooter}>ดูทั้งหมด</div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
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
                    <button onClick={() => setShowNotifications(!showNotifications)} style={styles.mobileMenuItem}>
                        <span style={styles.menuIcon}>🔔</span>
                        <span>การแจ้งเตือน ({notifications.filter(n => n.unread).length})</span>
                    </button>
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradient
        color: '#fff',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)', // Shadow Glow
        transform: 'translateY(-1px)',
    },
    menuIcon: {
        fontSize: '18px',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
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
    /* Notification Styles */
    notificationBtn: {
        position: 'relative',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'all 0.2s',
    },
    notificationBadge: {
        position: 'absolute',
        top: '6px',
        right: '6px',
        width: '10px',
        height: '10px',
        backgroundColor: '#e74c3c',
        borderRadius: '50%',
        border: '2px solid white',
    },
    notificationDropdown: {
        position: 'absolute',
        top: '120%',
        right: '-100px', /* Shift slightly left */
        width: '320px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '1px solid #f0f0f0',
        zIndex: 1100,
        overflow: 'hidden',
    },
    notificationHeader: {
        padding: '16px',
        fontWeight: 'bold',
        borderBottom: '1px solid #f0f0f0',
        color: '#333',
    },
    notificationList: {
        maxHeight: '300px',
        overflowY: 'auto',
    },
    notificationItem: {
        padding: '12px 16px',
        borderBottom: '1px solid #f8f8f8',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    notificationText: {
        fontSize: '14px',
        marginBottom: '4px',
        color: '#444',
        lineHeight: '1.4',
    },
    notificationTime: {
        fontSize: '11px',
        color: '#999',
    },
    notificationFooter: {
        padding: '12px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#667eea',
        cursor: 'pointer',
        fontWeight: '600',
        borderTop: '1px solid #f0f0f0',
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

// Media queries
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
