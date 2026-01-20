
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

import styles from './page.module.css';

function DashboardContent() {
    const { user } = useAuth();
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Settings State
    const [openDates, setOpenDates] = useState([]);
    const [availableWeekends, setAvailableWeekends] = useState([]);

    // Generate upcoming weekends (Next 2 months)
    useEffect(() => {
        const weekends = [];
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 2); // Get 2 months ahead

        for (let d = new Date(today); d <= nextMonth; d.setDate(d.getDate() + 1)) {
            if (d.getDay() === 0 || d.getDay() === 6) { // 0=Sunday, 6=Saturday
                weekends.push(new Date(d));
            }
        }
        setAvailableWeekends(weekends);
    }, []);

    // Fetch Settings
    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.openDates) {
                    setOpenDates(data.data.openDates);
                }
            });
    }, []);

    // Toggle Date Selection
    const toggleDate = async (dateStr) => {
        let newDates;
        if (openDates.includes(dateStr)) {
            newDates = openDates.filter(d => d !== dateStr);
        } else {
            newDates = [...openDates, dateStr];
        }
        setOpenDates(newDates);

        // Save to API
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ openDates: newDates })
            });
        } catch (error) {
            console.error('Failed to save dates');
        }
    };

    // Fetch Bookings from API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings');
                const data = await response.json();
                if (data.success) {
                    setBookings(data.data.map(b => ({
                        id: b.id,
                        shopName: `บูธ ${b.booths ? b.booths.join(', ') : '-'}`, // Use booths as shop name equivalent
                        owner: b.name,
                        phone: b.phone,
                        type: 'ทั่วไป', // Default type
                        status: b.status === 'pending' ? '🏷️ รออนุมัติ' :
                            b.status === 'approved' ? '✅ อนุมัติแล้ว' :
                                b.status === 'rejected' ? '❌ ปฏิเสธแล้ว' : '⏳ รอจ่ายเงิน',
                        statusColor: b.status === 'pending' ? '#f39c12' :
                            b.status === 'approved' ? '#27ae60' :
                                b.status === 'rejected' ? '#e74c3c' : '#95a5a6',
                        actions: ['👁️ ตรวจสอบ'],
                        bookingDate: (b.targetDates && b.targetDates.length > 0) ?
                            b.targetDates.map(d => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })).join(', ') :
                            (b.targetDate ?
                                new Date(b.targetDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) :
                                new Date(b.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            ),
                        slipImage: b.paymentSlip,
                        price: b.price || b.totalPrice
                    })));
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleActionClick = (action, booking) => {
        setSelectedBooking(booking);
    };

    const handleUpdateStatus = async (bookingId, newStatus) => {
        // Optimistic UI Update
        const statusLabel = newStatus === 'approved' ? '✅ อนุมัติแล้ว' : '❌ ปฏิเสธแล้ว';
        const color = newStatus === 'approved' ? '#27ae60' : '#e74c3c';

        // Call API to update status
        try {
            const res = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: bookingId, status: newStatus })
            });
            const data = await res.json();

            if (data.success) {
                // Update Local State
                setBookings(prev => prev.map(b =>
                    b.id === bookingId ? { ...b, status: statusLabel, statusColor: color } : b
                ));
                setSelectedBooking(null); // Close modal
                alert(`อัปเดตสถานะเป็น ${statusLabel} เรียบร้อยแล้ว`);
            } else {
                alert('เกิดข้อผิดพลาด: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
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

    if (loading) return <div>กำลังโหลดข้อมูล...</div>;

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.container}>
                {/* Welcome Section */}
                <div className={styles.welcomeSection}>
                    <div>
                        <h1 className={styles.welcomeTitle}>
                            สวัสดี, ผู้ดูแลระบบ ({user?.name || 'Admin'})! 👋
                        </h1>
                        <p className={styles.welcomeSubtitle}>
                            จัดการการจองและตรวจสอบสลิปการโอนเงิน
                        </p>
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

                {/* Filter Section */}
                <div className={styles.searchSection}>
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



                {/* Settings Section (New) */}
                <div style={{ marginBottom: '24px', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
                        📅 จัดการวันที่เปิดจอง (เฉพาะ เสาร์-อาทิตย์)
                    </h2>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {availableWeekends.map((date, idx) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = openDates.includes(dateStr);
                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !isPast && toggleDate(dateStr)}
                                    disabled={isPast}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: `2px solid ${isSelected ? '#667eea' : '#e2e8f0'}`,
                                        backgroundColor: isSelected ? '#667eea' : (isPast ? '#f3f4f6' : 'white'),
                                        color: isSelected ? 'white' : (isPast ? '#cbd5e1' : '#475569'),
                                        cursor: isPast ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        minWidth: '100px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{ fontSize: '12px', opacity: 0.8 }}>
                                        {date.toLocaleDateString('th-TH', { weekday: 'long' })}
                                    </span>
                                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        {date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                    </span>
                                </button>
                            );
                        })}
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
                                <th>การตรวจสอบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        ไม่พบข้อมูลการจอง
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
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
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleActionClick('view', booking)}
                                            >
                                                👁️ ตรวจสลิป / อนุมัติ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Modal with Slip */}
            {
                selectedBooking && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setSelectedBooking(null)}
                            >
                                ✕
                            </button>

                            <div className={styles.slipContainer}>
                                <div className={styles.slipHeader}>
                                    <h2 className={styles.slipTitle}>📝 ตรวจสอบการจอง & สลิปโอนเงิน</h2>
                                </div>

                                <div className={styles.divider}></div>

                                {/* Booking Details */}
                                <div className={styles.slipDetails}>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>ร้านค้า:</span>
                                        <span className={styles.value}>{selectedBooking.shopName}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>ผู้จอง:</span>
                                        <span className={styles.value}>{selectedBooking.owner}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>เบอร์โทร:</span>
                                        <span className={styles.value}>{selectedBooking.phone}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>วันที่จอง:</span>
                                        <span className={styles.value}>{selectedBooking.bookingDate} น.</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>ยอดเงินที่แจ้ง:</span>
                                        <span className={styles.value} style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '18px' }}>
                                            ฿{selectedBooking.price ? Number(selectedBooking.price).toLocaleString() : '0'}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Slip Image Section */}
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#333' }}>หลักฐานการโอนเงิน (Slip)</h3>
                                    <div style={{
                                        border: '1px dashed #ccc',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        minHeight: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#f9f9f9'
                                    }}>
                                        {selectedBooking.slipImage ? (
                                            <img
                                                src={selectedBooking.slipImage}
                                                alt="Payment Slip"
                                                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px' }}
                                            />
                                        ) : (
                                            <p style={{ color: '#999' }}>❌ ไม่พบรูปสลิปแนบมา</p>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.divider}></div>

                                {/* Approval Actions */}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedBooking.id, 'approved')}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#2ecc71',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ✅ อนุมัติการจอง
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedBooking.id, 'rejected')}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ❌ ปฏิเสธ / ยกเลิก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

