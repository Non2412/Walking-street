/**
 * Dashboard Page - หน้าหลักหลังเข้าสู่ระบบ
 * ป้องกันด้วย ProtectedRoute
 */

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function DashboardContent() {
    const { user } = useAuth();
    const router = useRouter();

    // Mock data
    const stats = [
        { id: 1, title: 'การจองทั้งหมด', value: '24', icon: '📋', color: '#3498db' },
        { id: 2, title: 'รออนุมัติ', value: '8', icon: '⏳', color: '#f39c12' },
        { id: 3, title: 'อนุมัติแล้ว', value: '14', icon: '✅', color: '#27ae60' },
        { id: 4, title: 'ปฏิเสธ', value: '2', icon: '❌', color: '#e74c3c' },
    ];

    const quickActions = [
        { id: 1, title: 'สร้างการจอง', icon: '➕', color: '#667eea', path: '/bookings/create' },
        { id: 2, title: 'ดูการจอง', icon: '📋', color: '#3498db', path: '/bookings' },
        { id: 3, title: 'คลังสินค้า', icon: '📦', color: '#9b59b6', path: '/inventory' },
        { id: 4, title: 'รายงาน', icon: '📊', color: '#e67e22', path: '/reports' },
    ];

    const recentActivities = [
        { id: 1, action: 'สร้างการจองใหม่', time: '5 นาทีที่แล้ว', icon: '➕', color: '#27ae60' },
        { id: 2, action: 'อนุมัติการจอง #1234', time: '1 ชั่วโมงที่แล้ว', icon: '✅', color: '#3498db' },
        { id: 3, action: 'แก้ไขข้อมูลร้าน', time: '2 ชั่วโมงที่แล้ว', icon: '✏️', color: '#f39c12' },
        { id: 4, action: 'ดูรายงานประจำเดือน', time: '3 ชั่วโมงที่แล้ว', icon: '📊', color: '#9b59b6' },
    ];

    return (
        <div style={styles.pageContainer}>
            <Navbar />

            <div style={styles.container}>
                {/* Welcome Section */}
                <div style={styles.welcomeSection}>
                    <div>
                        <h1 style={styles.welcomeTitle}>
                            สวัสดี, {user?.name}! 👋
                        </h1>
                        <p style={styles.welcomeSubtitle}>
                            ยินดีต้อนรับสู่ระบบจัดการตลาดถนนคนเดินศรีสะเกษ
                        </p>
                    </div>
                    <div style={styles.dateSection}>
                        <span style={styles.dateText}>
                            📅 {new Date().toLocaleDateString('th-TH', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    {stats.map((stat) => (
                        <div key={stat.id} style={styles.statCard}>
                            <div style={styles.statHeader}>
                                <span style={{ ...styles.statIcon, backgroundColor: stat.color + '20' }}>
                                    {stat.icon}
                                </span>
                                <h3 style={styles.statTitle}>{stat.title}</h3>
                            </div>
                            <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>เมนูด่วน</h2>
                    <div style={styles.actionsGrid}>
                        {quickActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => router.push(action.path)}
                                style={{ ...styles.actionCard, borderTop: `4px solid ${action.color}` }}
                            >
                                <div style={{ ...styles.actionIcon, color: action.color }}>
                                    {action.icon}
                                </div>
                                <span style={styles.actionTitle}>{action.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>กิจกรรมล่าสุด</h2>
                    <div style={styles.activitiesCard}>
                        {recentActivities.map((activity) => (
                            <div key={activity.id} style={styles.activityItem}>
                                <div style={{ ...styles.activityIcon, backgroundColor: activity.color + '20', color: activity.color }}>
                                    {activity.icon}
                                </div>
                                <div style={styles.activityContent}>
                                    <span style={styles.activityAction}>{activity.action}</span>
                                    <span style={styles.activityTime}>{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 24px',
    },
    welcomeSection: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
    },
    welcomeTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: '0 0 8px 0',
    },
    welcomeSubtitle: {
        fontSize: '16px',
        color: '#7f8c8d',
        margin: 0,
    },
    dateSection: {
        padding: '12px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
    },
    dateText: {
        fontSize: '14px',
        color: '#666',
        fontWeight: '600',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s',
    },
    statHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    },
    statIcon: {
        fontSize: '32px',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
    },
    statTitle: {
        fontSize: '14px',
        color: '#7f8c8d',
        margin: 0,
        fontWeight: '600',
    },
    statValue: {
        fontSize: '36px',
        fontWeight: 'bold',
        margin: 0,
    },
    section: {
        marginBottom: '40px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '20px',
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
    },
    actionCard: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        textAlign: 'center',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
    },
    actionIcon: {
        fontSize: '48px',
    },
    actionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    activitiesCard: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    activityItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    activityIcon: {
        fontSize: '24px',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
    },
    activityContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    activityAction: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2c3e50',
    },
    activityTime: {
        fontSize: '12px',
        color: '#7f8c8d',
    },
};
