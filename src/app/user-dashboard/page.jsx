'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function UserDashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ตรวจสอบสิทธิ์
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // ถ้าเป็น admin ให้ไป /admin-dashboard แทน
        if (user?.role === 'admin') {
            router.push('/admin-dashboard');
            return;
        }

        // ดึงข้อมูลการจองของ user
        fetchUserBookings();
    }, [isAuthenticated, user]);

    const fetchUserBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            const data = await response.json();
            
            if (data.success) {
                // Filter เฉพาะการจองของ user นี้
                const userBookings = data.data || [];
                setBookings(userBookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loading}>กำลังโหลด...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>📊 หน้า User Dashboard</h1>
                    <p>ยินดีต้อนรับ, {user?.name || 'User'}!</p>
                </div>
                <button 
                    className={styles.logoutBtn}
                    onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        router.push('/login');
                    }}
                >
                    ออกจากระบบ
                </button>
            </div>

            {/* User Info */}
            <div className={styles.infoCard}>
                <h2>ข้อมูลของคุณ</h2>
                <div className={styles.infoGrid}>
                    <div>
                        <label>ชื่อ:</label>
                        <p>{user?.name || '-'}</p>
                    </div>
                    <div>
                        <label>อีเมล:</label>
                        <p>{user?.email || '-'}</p>
                    </div>
                    <div>
                        <label>ร้านค้า:</label>
                        <p>{user?.shopName || '-'}</p>
                    </div>
                    <div>
                        <label>เบอร์โทร:</label>
                        <p>{user?.phone || '-'}</p>
                    </div>
                </div>
            </div>

            {/* My Bookings */}
            <div className={styles.bookingsCard}>
                <h2>🎫 การจองของฉัน</h2>
                
                {bookings.length === 0 ? (
                    <p className={styles.noBookings}>ยังไม่มีการจองในระบบ</p>
                ) : (
                    <div className={styles.bookingsList}>
                        {bookings.map((booking) => (
                            <div key={booking._id} className={styles.bookingItem}>
                                <div className={styles.bookingHeader}>
                                    <h3>{booking.storeName}</h3>
                                    <span className={`${styles.status} ${styles[booking.status]}`}>
                                        {booking.status === 'pending' && '⏳ รอการยืนยัน'}
                                        {booking.status === 'approved' && '✅ อนุมัติแล้ว'}
                                        {booking.status === 'rejected' && '❌ ปฏิเสธ'}
                                    </span>
                                </div>
                                
                                <div className={styles.bookingDetails}>
                                    <p><strong>เจ้าของร้าน:</strong> {booking.ownerName}</p>
                                    <p><strong>เบอร์โทร:</strong> {booking.phone}</p>
                                    <p><strong>ประเภท:</strong> {booking.shopType}</p>
                                    <p><strong>หมายเลขสถาน:</strong> {booking.stallNumber}</p>
                                    <p><strong>วันที่จอง:</strong> {new Date(booking.bookingDate).toLocaleDateString('th-TH')}</p>
                                    {booking.notes && (
                                        <p><strong>หมายเหตุ:</strong> {booking.notes}</p>
                                    )}
                                </div>
                                
                                <div className={styles.bookingActions}>
                                    <button className={styles.viewBtn}>👁️ ดูรายละเอียด</button>
                                    {booking.status === 'pending' && (
                                        <button className={styles.editBtn}>✏️ แก้ไข</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
                <button className={styles.createBookingBtn}>
                    ➕ สร้างการจองใหม่
                </button>
                <button className={styles.historyBtn}>
                    📜 ประวัติการจอง
                </button>
            </div>
        </div>
    );
}
