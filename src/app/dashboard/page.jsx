/**
 * Dashboard Page - หน้าหลักหลังเข้าสู่ระบบ
 * ป้องกันด้วย ProtectedRoute
 */

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

function DashboardContent() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>🏪 Dashboard</h1>
                    <p style={styles.subtitle}>ยินดีต้อนรับ, {user?.name}!</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    🚪 ออกจากระบบ
                </button>
            </div>

            {/* User Info Card */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>ข้อมูลผู้ใช้</h2>
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>ชื่อ:</span>
                        <span style={styles.infoValue}>{user?.name}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>อีเมล:</span>
                        <span style={styles.infoValue}>{user?.email}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>บทบาท:</span>
                        <span style={styles.badge}>{user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.actionsGrid}>
                <ActionCard
                    icon="📋"
                    title="รายการจอง"
                    description="ดูและจัดการการจองทั้งหมด"
                    onClick={() => router.push('/bookings')}
                />
                <ActionCard
                    icon="➕"
                    title="สร้างการจอง"
                    description="เพิ่มการจองใหม่"
                    onClick={() => router.push('/bookings/create')}
                />
                <ActionCard
                    icon="👤"
                    title="โปรไฟล์"
                    description="แก้ไขข้อมูลส่วนตัว"
                    onClick={() => router.push('/profile')}
                />
                <ActionCard
                    icon="⚙️"
                    title="ตั้งค่า"
                    description="ตั้งค่าระบบ"
                    onClick={() => router.push('/settings')}
                />
            </div>

            {/* Stats */}
            <div style={styles.statsGrid}>
                <StatCard title="การจองทั้งหมด" value="24" color="#3498db" />
                <StatCard title="รออนุมัติ" value="8" color="#f39c12" />
                <StatCard title="อนุมัติแล้ว" value="14" color="#27ae60" />
                <StatCard title="ปฏิเสธ" value="2" color="#e74c3c" />
            </div>
        </div>
    );
}

function ActionCard({ icon, title, description, onClick }) {
    return (
        <div style={styles.actionCard} onClick={onClick}>
            <div style={styles.actionIcon}>{icon}</div>
            <h3 style={styles.actionTitle}>{title}</h3>
            <p style={styles.actionDescription}>{description}</p>
        </div>
    );
}

function StatCard({ title, value, color }) {
    return (
        <div style={{ ...styles.statCard, borderLeftColor: color }}>
            <h4 style={styles.statTitle}>{title}</h4>
            <p style={{ ...styles.statValue, color }}>{value}</p>
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
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        padding: '40px 20px',
    },
    header: {
        maxWidth: '1200px',
        margin: '0 auto 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitle: {
        margin: 0,
        fontSize: '16px',
        color: '#7f8c8d',
    },
    logoutButton: {
        padding: '12px 24px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    card: {
        maxWidth: '1200px',
        margin: '0 auto 40px',
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#7f8c8d',
        minWidth: '80px',
    },
    infoValue: {
        color: '#2c3e50',
    },
    badge: {
        padding: '4px 12px',
        backgroundColor: '#3498db',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    actionsGrid: {
        maxWidth: '1200px',
        margin: '0 auto 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    },
    actionIcon: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    actionTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    actionDescription: {
        margin: 0,
        fontSize: '14px',
        color: '#7f8c8d',
    },
    statsGrid: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
    },
    statCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderLeft: '4px solid',
    },
    statTitle: {
        margin: '0 0 12px 0',
        fontSize: '14px',
        color: '#7f8c8d',
        fontWeight: '600',
    },
    statValue: {
        margin: 0,
        fontSize: '32px',
        fontWeight: 'bold',
    },
};
