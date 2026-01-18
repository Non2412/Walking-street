
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

import styles from './page.module.css';

function DashboardContent() {
    const { user } = useAuth();


    // Mock data
    const stats = [
        { id: 1, title: 'การจองทั้งหมด', value: '24', icon: '📋', color: '#3498db' },
        { id: 2, title: 'รออนุมัติ', value: '8', icon: '⏳', color: '#f39c12' },
        { id: 3, title: 'อนุมัติแล้ว', value: '14', icon: '✅', color: '#27ae60' },
        { id: 4, title: 'ปฏิเสธ', value: '2', icon: '❌', color: '#e74c3c' },
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

