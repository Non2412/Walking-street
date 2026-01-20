
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

import styles from './page.module.css';

function DashboardContent() {
    const { user } = useAuth();
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([
        {
            id: 1,
            shopName: 'ร้านคำแพก้า',
            owner: 'สมชาย โชค',
            phone: '0812345678',
            type: 'food',
            status: '🏷️ รออนุมัติ',
            statusColor: '#f39c12',
            actions: ['👁️ ดู', '✅ อนุมัติ', '❌ ปฏิเสธ', '🗑️ ลบ']
        },
        {
            id: 2,
            shopName: 'ร้านแอ่มร้อ Modern',
            owner: 'สรัย สรนโร',
            phone: '0896765432',
            type: 'clothing',
            status: '✅ อนุมัติแล้ว',
            statusColor: '#27ae60',
            actions: ['👁️ ดู', '❌ ปฏิเสธ', '🗑️ ลบ']
        },
        {
            id: 3,
            shopName: 'ร้านขมเมาราง Golden',
            owner: 'คำ รศสราง',
            phone: '0867543210',
            type: 'food',
            status: '❌ ปฏิเสธแล้ว',
            statusColor: '#e74c3c',
            actions: ['👁️ ดู', '✅ อนุมัติ', '🗑️ ลบ']
        },
        {
            id: 4,
            shopName: 'ร้านหมวดสินค้า',
            owner: 'มณีชา วรรณ',
            phone: '0956789123',
            type: 'accessories',
            status: '🏷️ รออนุมัติ',
            statusColor: '#f39c12',
            actions: ['👁️ ดู', '✅ อนุมัติ', '❌ ปฏิเสธ', '🗑️ ลบ']
        }
    ]);

    const handleActionClick = (action, booking) => {
        const actionType = action.split(' ')[1];

        if (actionType === 'ดู' || action.includes('👁️')) {
            setSelectedBooking(booking);
        } else if (actionType === 'อนุมัติ' || action.includes('✅')) {
            const updated = bookings.map(b =>
                b.id === booking.id
                    ? { ...b, status: '✅ อนุมัติแล้ว', statusColor: '#27ae60' }
                    : b
            );
            setBookings(updated);
            alert(`✅ อนุมัติการจองสำเร็จ: ${booking.shopName}`);
        } else if (actionType === 'ปฏิเสธ' || action.includes('❌')) {
            const updated = bookings.map(b =>
                b.id === booking.id
                    ? { ...b, status: '❌ ปฏิเสธแล้ว', statusColor: '#e74c3c' }
                    : b
            );
            setBookings(updated);
            alert(`❌ ปฏิเสธการจอง: ${booking.shopName}`);
        } else if (actionType === 'ลบ' || action.includes('🗑️')) {
            const updated = bookings.filter(b => b.id !== booking.id);
            setBookings(updated);
            alert(`🗑️ ลบการจองสำเร็จ: ${booking.shopName}`);
        }
    };

    // Update stats based on current bookings
    const stats = [
        { id: 1, title: 'การจองทั้งหมด', value: bookings.length.toString(), icon: '📋', color: '#3498db' },
        { id: 2, title: 'รออนุมัติ', value: bookings.filter(b => b.status.includes('รออนุมัติ')).length.toString(), icon: '⏳', color: '#f39c12' },
        { id: 3, title: 'อนุมัติแล้ว', value: bookings.filter(b => b.status.includes('อนุมัติแล้ว')).length.toString(), icon: '✅', color: '#27ae60' },
        { id: 4, title: 'ปฏิเสธ', value: bookings.filter(b => b.status.includes('ปฏิเสธแล้ว')).length.toString(), icon: '❌', color: '#e74c3c' },
    ];

    const filterButtons = ['ทั้งหมด', 'รออนุมัติ', 'อนุมัติแล้ว', 'ปฏิเสธแล้ว'];

    const filteredBookings = filterStatus === 'ทั้งหมด'
        ? bookings
        : bookings.filter(b => b.status.includes(filterStatus.split('แล้ว')[0]));

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

                {/* Search & Filter Section */}
                <div className={styles.searchSection}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="ค้นหา"
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterButtons}>
                        {filterButtons.map((button) => (
                            <button
                                key={button}
                                className={`${styles.filterButton} ${filterStatus === button ? styles.active : ''}`}
                                onClick={() => setFilterStatus(button)}
                            >
                                {button}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings Table */}
                <div className={styles.tableSection}>
                    <table className={styles.bookingsTable}>
                        <thead>
                            <tr>
                                <th>ชื่อร้าน</th>
                                <th>เจ้าของ</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>ประเภท</th>
                                <th>สถานะ</th>
                                <th>การดำเนิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.shopName}</td>
                                    <td>{booking.owner}</td>
                                    <td>{booking.phone}</td>
                                    <td>{booking.type}</td>
                                    <td>
                                        <span
                                            style={{
                                                backgroundColor: booking.statusColor + '20',
                                                color: booking.statusColor,
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className={styles.actionButtons}>
                                        {booking.actions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                className={styles.actionBtn}
                                                title={action}
                                                onClick={() => handleActionClick(action, booking)}
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slip Modal */}
            {selectedBooking && (
                <div className={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedBooking(null)}
                        >
                            ✕
                        </button>

                        <div className={styles.slipContainer}>
                            {/* Header */}
                            <div className={styles.slipHeader}>
                                <h2 className={styles.slipTitle}>📄 สลิปการจอง</h2>
                                <p className={styles.slipDate}>
                                    วันที่: {new Date().toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className={styles.divider}></div>

                            {/* Details */}
                            <div className={styles.slipDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>หมายเลขการจอง:</span>
                                    <span className={styles.value}>#{selectedBooking.id.toString().padStart(4, '0')}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>ชื่อร้าน:</span>
                                    <span className={styles.value}>{selectedBooking.shopName}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>เจ้าของ:</span>
                                    <span className={styles.value}>{selectedBooking.owner}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>เบอร์โทรศัพท์:</span>
                                    <span className={styles.value}>{selectedBooking.phone}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>ประเภทร้าน:</span>
                                    <span className={styles.value}>{selectedBooking.type}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className={styles.divider}></div>

                            {/* Status */}
                            <div className={styles.statusSection}>
                                <span className={styles.label}>สถานะ:</span>
                                <span
                                    className={styles.statusBadge}
                                    style={{
                                        backgroundColor: selectedBooking.statusColor + '20',
                                        color: selectedBooking.statusColor,
                                    }}
                                >
                                    {selectedBooking.status}
                                </span>
                            </div>

                            {/* Footer */}
                            <div className={styles.slipFooter}>
                                <p>ขอบคุณที่ใช้บริการ</p>
                                <p>ระบบจัดการตลาดถนนคนเดิน ศรีสะเกษ</p>
                            </div>

                            {/* Print Button */}
                            <button
                                className={styles.printBtn}
                                onClick={() => window.print()}
                            >
                                🖨️ พิมพ์
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    return (
        // <ProtectedRoute>
        <DashboardContent />
        // </ProtectedRoute>
    );
}

