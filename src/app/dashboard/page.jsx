
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

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
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.container}>
                {/* Welcome Section */}
                <div className={styles.welcomeSection}>
                    <div>
                        <h1 className={styles.welcomeTitle}>
                            สวัสดี, {user?.name}! 👋
                        </h1>
                        <p className={styles.welcomeSubtitle}>
                            ยินดีต้อนรับสู่ระบบจัดการตลาดถนนคนเดินศรีสะเกษ
                        </p>
                    </div>
                    <div className={styles.dateSection}>
                        <span className={styles.dateText}>
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
                <div className={styles.statsGrid}>
                    {stats.map((stat) => (
                        <div key={stat.id} className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <span className={styles.statIcon} style={{ backgroundColor: stat.color + '20' }}>
                                    {stat.icon}
                                </span>
                                <h3 className={styles.statTitle}>{stat.title}</h3>
                            </div>
                            <p className={styles.statValue} style={{ color: stat.color }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>เมนูด่วน</h2>
                    <div className={styles.actionsGrid}>
                        {quickActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => router.push(action.path)}
                                className={styles.actionCard}
                                style={{ borderTop: `4px solid ${action.color}` }}
                            >
                                <div className={styles.actionIcon} style={{ color: action.color }}>
                                    {action.icon}
                                </div>
                                <span className={styles.actionTitle}>{action.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>กิจกรรมล่าสุด</h2>
                    <div className={styles.activitiesCard}>
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className={styles.activityItem}>
                                <div className={styles.activityIcon} style={{ backgroundColor: activity.color + '20', color: activity.color }}>
                                    {activity.icon}
                                </div>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityAction}>{activity.action}</span>
                                    <span className={styles.activityTime}>{activity.time}</span>
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

