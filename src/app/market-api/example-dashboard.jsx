/**
 * ตัวอย่างหน้า Dashboard สำหรับจัดการการจองพื้นที่ตลาด
 * วางไฟล์นี้ที่: src/app/bookings/page.jsx
 * 
 * หรือคัดลอกโค้ดไปใช้ในหน้าที่ต้องการ
 */

'use client';

import { useState } from 'react';
import { useBookings } from '@/market-api/hooks/useBookings';
import BookingList from '@/market-api/components/BookingList';
import BookingForm from '@/market-api/components/BookingForm';
import {
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_COLORS
} from '@/market-api/types/booking';

export default function BookingDashboard() {
    const { bookings, loading, error } = useBookings();
    const [activeTab, setActiveTab] = useState('all');
    const [showForm, setShowForm] = useState(false);

    // คำนวณสถิติ
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        approved: bookings.filter(b => b.status === 'approved').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>🏪 ระบบจัดการการจองพื้นที่ตลาด</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={styles.addButton}
                >
                    {showForm ? '✕ ปิดฟอร์ม' : '+ สร้างการจองใหม่'}
                </button>
            </div>

            {/* Statistics Cards */}
            <div style={styles.statsGrid}>
                <StatCard
                    title="ทั้งหมด"
                    value={stats.total}
                    color="#3498db"
                    icon="📊"
                />
                <StatCard
                    title="รออนุมัติ"
                    value={stats.pending}
                    color="#FFA500"
                    icon="⏳"
                />
                <StatCard
                    title="อนุมัติแล้ว"
                    value={stats.approved}
                    color="#4CAF50"
                    icon="✓"
                />
                <StatCard
                    title="ปฏิเสธ"
                    value={stats.rejected}
                    color="#F44336"
                    icon="✗"
                />
            </div>

            {/* Form (แสดงเมื่อกดปุ่ม) */}
            {showForm && (
                <div style={styles.formContainer}>
                    <BookingForm
                        onSuccess={() => {
                            setShowForm(false);
                            alert('สร้างการจองสำเร็จ!');
                        }}
                    />
                </div>
            )}

            {/* Tabs */}
            <div style={styles.tabs}>
                <TabButton
                    active={activeTab === 'all'}
                    onClick={() => setActiveTab('all')}
                >
                    ทั้งหมด ({stats.total})
                </TabButton>
                <TabButton
                    active={activeTab === 'pending'}
                    onClick={() => setActiveTab('pending')}
                >
                    รออนุมัติ ({stats.pending})
                </TabButton>
                <TabButton
                    active={activeTab === 'approved'}
                    onClick={() => setActiveTab('approved')}
                >
                    อนุมัติแล้ว ({stats.approved})
                </TabButton>
                <TabButton
                    active={activeTab === 'rejected'}
                    onClick={() => setActiveTab('rejected')}
                >
                    ปฏิเสธ ({stats.rejected})
                </TabButton>
            </div>

            {/* Booking List */}
            <div style={styles.listContainer}>
                {loading ? (
                    <div style={styles.loading}>กำลังโหลดข้อมูล...</div>
                ) : error ? (
                    <div style={styles.error}>เกิดข้อผิดพลาด: {error}</div>
                ) : (
                    <BookingList
                        filterStatus={activeTab === 'all' ? null : activeTab}
                    />
                )}
            </div>
        </div>
    );
}

// ========================================
// Sub Components
// ========================================

function StatCard({ title, value, color, icon }) {
    return (
        <div style={{
            ...styles.statCard,
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        }}>
            <div style={styles.statIcon}>{icon}</div>
            <div style={styles.statContent}>
                <h3 style={styles.statTitle}>{title}</h3>
                <p style={styles.statValue}>{value}</p>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            style={active ? { ...styles.tab, ...styles.tabActive } : styles.tab}
        >
            {children}
        </button>
    );
}

// ========================================
// Styles
// ========================================

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    title: {
        margin: 0,
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    addButton: {
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    statCard: {
        padding: '24px',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'transform 0.3s',
        cursor: 'pointer',
    },
    statIcon: {
        fontSize: '48px',
    },
    statContent: {
        flex: 1,
    },
    statTitle: {
        margin: '0 0 8px 0',
        fontSize: '16px',
        fontWeight: '500',
        opacity: 0.9,
    },
    statValue: {
        margin: 0,
        fontSize: '36px',
        fontWeight: 'bold',
    },
    formContainer: {
        marginBottom: '30px',
        animation: 'slideDown 0.3s ease',
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    tab: {
        flex: 1,
        padding: '12px 20px',
        border: 'none',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        color: '#666',
    },
    tabActive: {
        backgroundColor: '#3498db',
        color: '#fff',
    },
    listContainer: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '18px',
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        color: '#F44336',
        fontSize: '18px',
    },
};
