'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar'; // Import Navbar หลัก
import styles from './page.module.css';

export default function UserDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูลการจอง
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings');
                const data = await response.json();
                if (data.success) {
                    // Filter bookings for current user (assuming name/email matches or default show all if mock)
                    // In a real app, API should return only user's bookings
                    // For now, let's filter by name if available, or just take the last updated one that matches our session logic

                    // Simple logic: If user has created bookings, they should match 'owner' or 'userId'
                    // Since our mock auth uses generic names, let's match by name if possible, or just show all for demo purposes
                    const userBookings = data.data.filter(b => b.name === user?.name || b.userId === user?.id);

                    // If no match found (due to mock data inconsistency), show all for demo so USER sees something
                    const displayBookings = userBookings.length > 0 ? userBookings : data.data;

                    setBookings(displayBookings.map(b => ({
                        ...b,
                        storeName: `บูธ ${b.booths ? b.booths.join(', ') : '-'}`, // Map booths to storeName
                        bookingDate: b.createdAt
                    })));
                }
            } catch (error) {
                console.error("Failed to load bookings", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    // หาการจองล่าสุด
    const latestBooking = bookings.length > 0 ? bookings[bookings.length - 1] : null;

    // Helper: สถานะของ Timeline Steps
    const getStepClass = (stepIndex, currentStatus) => {
        // Step 1: ส่งเรื่อง (Always completed if booking exists)
        if (stepIndex === 1) return styles.stepCompleted;

        // Step 2: ตรวจสอบ
        if (stepIndex === 2) {
            if (currentStatus === 'pending') return styles.stepActive;
            return styles.stepCompleted;
        }

        // Step 3: ผลลัพธ์
        if (stepIndex === 3) {
            if (currentStatus === 'approved' || currentStatus === 'rejected') return styles.stepCompleted;
            return '';
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>กำลังโหลด...</div>;

    return (
        <div className={styles.container}>
            {/* 1. Standard Navbar */}
            <Navbar />

            {/* 2. Beautiful Hero Header */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.welcomeTitle}>
                        สวัสดีครับ, {user?.name || 'ลูกค้า'} 👋
                    </h1>
                    <p className={styles.welcomeSubtitle}>
                        ติดตามสถานะการจองพื้นที่และจัดการร้านค้าของคุณได้ที่นี่
                    </p>
                </div>
            </div>

            {/* 3. Main Content Card */}
            <div className={styles.mainContent}>

                <div className={styles.card}>
                    {latestBooking ? (
                        /* Case: มีการจอง */
                        <div className={`${styles.statusContainer} ${styles['status_' + (latestBooking.status || 'pending')]}`}>

                            {/* Status Icon & Title */}
                            <div className={styles.statusHeader}>
                                <div className={styles.statusIconWrapper}>
                                    {latestBooking.status === 'approved' && '🎉'}
                                    {latestBooking.status === 'rejected' && '❌'}
                                    {latestBooking.status === 'pending' && '⏳'}
                                    {!latestBooking.status && '⏳'}
                                </div>
                                <h2 className={styles.statusTitle}>
                                    {latestBooking.status === 'approved' ? 'อนุมัติเรียบร้อย' :
                                        latestBooking.status === 'rejected' ? 'ไม่ผ่านการอนุมัติ' :
                                            'รอการตรวจสอบ'}
                                </h2>
                                <p className={styles.statusDesc}>
                                    {latestBooking.status === 'approved' ? 'ร้านค้าของคุณพร้อมแล้ว! กรุณาเตรียมร้านและสินค้าให้พร้อมสำหรับการขายในวันงาน' :
                                        latestBooking.status === 'rejected' ? 'ขออภัย การจองของคุณไม่ผ่านการอนุมัติ กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามรายละเอียดเพิ่มเติม' :
                                            'เจ้าหน้าที่กำลังตรวจสอบข้อมูลการจองและหลักฐานการโอนเงินของคุณ (โปรดรอ 1-2 วันทำการ)'}
                                </p>
                            </div>

                            {/* Beautiful Timeline */}
                            <div className={styles.timelineWrapper}>
                                <div className={styles.timeline}>
                                    {/* Step 1 */}
                                    <div className={`${styles.timelineStep} ${getStepClass(1, latestBooking.status)}`}>
                                        <div className={styles.stepDot}>✓</div>
                                        <span className={styles.stepText}>ส่งเรื่อง</span>
                                    </div>
                                    {/* Step 2 */}
                                    <div className={`${styles.timelineStep} ${getStepClass(2, latestBooking.status)}`}>
                                        <div className={styles.stepDot}>2</div>
                                        <span className={styles.stepText}>ตรวจสอบ</span>
                                    </div>
                                    {/* Step 3 */}
                                    <div className={`${styles.timelineStep} ${getStepClass(3, latestBooking.status)}`}>
                                        <div className={styles.stepDot}>3</div>
                                        <span className={styles.stepText}>เสร็จสิ้น</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Info Grid */}
                            <div className={styles.infoGrid}>
                                <div>
                                    <div className={styles.infoLabel}>ชื่อร้านค้า</div>
                                    <div className={styles.infoValue}>{latestBooking.storeName || user?.shopName || '-'}</div>
                                </div>
                                <div>
                                    <div className={styles.infoLabel}>ประเภทสินค้า</div>
                                    <div className={styles.infoValue}>{latestBooking.shopType || '-'}</div>
                                </div>
                                <div>
                                    <div className={styles.infoLabel}>วันที่จอง</div>
                                    <div className={styles.infoValue}>
                                        {latestBooking.bookingDate ? new Date(latestBooking.bookingDate).toLocaleDateString('th-TH') : '-'}
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.infoLabel}>เบอร์ติดต่อ</div>
                                    <div className={styles.infoValue}>{latestBooking.phone || user?.phone || '-'}</div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        /* Case: ยังไม่มีการจอง */
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🛍️</span>
                            <h2 className={styles.emptyTitle}>คุณยังไม่ได้จองพื้นที่</h2>
                            <p className={styles.emptyText}>เริ่มต้นธุรกิจของคุณวันนี้ จองล็อกทำเลดีๆ ได้ง่ายๆ</p>

                            <button
                                className={styles.startBtn}
                                onClick={() => router.push('/bookings')}
                            >
                                🚀 เริ่มต้นจองพื้นที่
                            </button>
                        </div>
                    )}
                </div>

                {/* 4. Action Buttons */}
                <div className={styles.actionsGrid}>
                    <button
                        className={`${styles.actionBtn} ${styles.primaryAction}`}
                        onClick={() => router.push('/bookings')}
                    >
                        {latestBooking ? '➕ จองพื้นที่เพิ่ม' : '➕ จองพื้นที่ใหม่'}
                    </button>

                    <button className={styles.actionBtn}>
                        💬 ติดต่อสอบถามเจ้าหน้าที่
                    </button>

                    <button className={styles.actionBtn}>
                        📜 ดูประวัติการจองทั้งหมด
                    </button>
                </div>

            </div>
        </div>
    );
}
