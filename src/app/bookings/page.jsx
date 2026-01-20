/**
 * Bookings Page - หน้าจัดการการจองพื้นที่
 * แสดงแผนผังบูธแบบแถวนอน (Horizontal Rows)
 */

'use client';

import React, { useState } from 'react';
import { MarketAuthProvider } from '@/contexts/MarketAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import BookingList from '@/components/BookingList';
import styles from './page.module.css';
import Script from 'next/script';

function BookingsContent() {
    const { user } = useMarketAuth();
    const [selectedDay, setSelectedDay] = useState('saturday'); // saturday or sunday
    const [selectedBooths, setSelectedBooths] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

    // Booking Flow State
    const [bookingStep, setBookingStep] = useState(1);
    const [bookingDetails, setBookingDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: ''
    });
    const [myBookings, setMyBookings] = useState([]);

    // Update booking details when user loads
    React.useEffect(() => {
        if (user) {
            setBookingDetails(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || user.phoneNumber || ''
            }));
        }
    }, [user]);

    const [uploadPreview, setUploadPreview] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isVerifyingSlip, setIsVerifyingSlip] = useState(false);
    const [slipVerificationStatus, setSlipVerificationStatus] = useState(null); // 'success', 'failed', 'error'

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // OCR Verification
            if (window.Tesseract) {
                setIsVerifyingSlip(true);
                setSlipVerificationStatus(null);
                try {
                    const result = await window.Tesseract.recognize(
                        file,
                        'eng', // English is usually enough for numbers
                        // { logger: m => console.log(m) }
                    );

                    const text = result.data.text.replace(/,/g, ''); // Remove commas
                    const total = getTotalPrice(); // Check against total price

                    // Simple check: Is the total amount string present in the text?
                    // We check for exact match of the number, or formatted with 2 decimals
                    const hasTotal = text.includes(total.toString()) || text.includes(total.toFixed(2));

                    if (hasTotal) {
                        setSlipVerificationStatus('success');
                    } else {
                        console.warn('OCR Text:', text);
                        setSlipVerificationStatus('failed');
                    }
                } catch (error) {
                    console.error('OCR Error:', error);
                    setSlipVerificationStatus('error');
                } finally {
                    setIsVerifyingSlip(false);
                }
            } else {
                console.warn('Tesseract not loaded yet');
            }
        }
    };

    // สร้างข้อมูลบูธตามวันที่เลือก (ใช้ useMemo เพื่อไม่ให้สุ่มใหม่ทุกครั้ง)
    const boothsData = React.useMemo(() => {
        const booths = {
            A: [],
            B: [],
            C: [],
        };

        // กำหนดจำนวนช่องตามวัน (สมดุลกันมากขึ้น)
        const counts = selectedDay === 'saturday'
            ? { A: 10, B: 20, C: 10 }  // วันเสาร์: 40 ช่อง (10+20+10)
            : { A: 30, B: 40, C: 30 }; // วันอาทิตย์: 100 ช่อง (30+40+30)

        // Zone A (฿500)
        for (let i = 1; i <= counts.A; i++) {
            const id = `A-${String(i).padStart(2, '0')}`;
            const rand = (i * 7) % 10; // ใช้ pattern แทน random

            // Check if booked by current user
            const isMyBooking = myBookings.includes(id);

            booths.A.push({
                id,
                zone: 'A',
                price: 500,
                status: isMyBooking ? 'pending' : (rand > 7 ? (rand > 8 ? 'booked' : 'pending') : 'available'),
                bookedBy: rand > 5 ? 'ร้านตัวอย่าง' : null,
                isMyBooking
            });
        }

        // Zone B (฿700)
        for (let i = 1; i <= counts.B; i++) {
            const id = `B-${String(i).padStart(2, '0')}`;
            const rand = (i * 11) % 10;
            const isMyBooking = myBookings.includes(id);

            booths.B.push({
                id,
                zone: 'B',
                price: 700,
                status: isMyBooking ? 'pending' : (rand > 7 ? (rand > 8 ? 'booked' : 'pending') : 'available'),
                bookedBy: rand > 5 ? 'ร้านตัวอย่าง' : null,
                isMyBooking
            });
        }

        // Zone C (฿1000)
        for (let i = 1; i <= counts.C; i++) {
            const id = `C-${String(i).padStart(2, '0')}`;
            const rand = (i * 13) % 10;
            const isMyBooking = myBookings.includes(id);

            booths.C.push({
                id,
                zone: 'C',
                price: 1000,
                status: isMyBooking ? 'pending' : (rand > 7 ? (rand > 8 ? 'booked' : 'pending') : 'available'),
                bookedBy: rand > 5 ? 'ร้านตัวอย่าง' : null,
                isMyBooking
            });
        }

        return booths;
    }, [selectedDay, myBookings]);

    const allBooths = [...boothsData.A, ...boothsData.B, ...boothsData.C];

    // คำนวณสถิติ
    const stats = {
        total: allBooths.length,
        available: allBooths.filter(b => b.status === 'available').length,
        booked: allBooths.filter(b => b.status === 'booked').length,
        pending: allBooths.filter(b => b.status === 'pending').length,
    };

    const handleBoothClick = (booth) => {
        if (booth.status === 'available') {
            setSelectedBooths(prev => {
                const isSelected = prev.some(b => b.id === booth.id);
                if (isSelected) {
                    return prev.filter(b => b.id !== booth.id);
                } else {
                    if (prev.length >= 3) {
                        setShowLimitModal(true);
                        return prev;
                    }
                    return [...prev, booth];
                }
            });
        }
    };

    const isBoothSelected = (id) => selectedBooths.some(b => b.id === id);

    const getStatusIcon = (status, isSelected) => {
        if (isSelected) return '✓';
        switch (status) {
            case 'available': return '';
            case 'booked': return '🔒';
            case 'pending': return '⏳';
            default: return '';
        }
    };

    const getStatusColor = (status, isSelected) => {
        if (isSelected) return '#fff';
        switch (status) {
            case 'available': return '#27ae60';
            case 'booked': return '#e74c3c';
            case 'pending': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    const getTotalPrice = () => {
        return selectedBooths.reduce((sum, booth) => sum + booth.price, 0);
    };

    return (
        <div className={styles.pageContainer} >
            <Navbar />

            <div className={styles.container}>
                <div className={styles.layoutWrapper}>
                    <div className={styles.mainContent}>
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

                        {/* Day Selection */}
                        <div className={styles.dayButtons}>
                            <button
                                className={`${styles.dayButton} ${selectedDay === 'saturday' ? styles.dayButtonActive : ''}`}
                                style={{
                                    backgroundColor: selectedDay === 'saturday' ? '#667eea' : '#f8f9fa',
                                    color: selectedDay === 'saturday' ? '#fff' : '#666'
                                }}
                                onClick={() => {
                                    setSelectedDay('saturday');
                                    setSelectedBooths([]); // Reset selection on day change
                                }}
                            >
                                <span className={styles.dayIcon}>📅</span>
                                <span className={styles.dayText}>วันเสาร์</span>
                                <span className={styles.daySubtext}>เปิดจองพรุ่งนี้</span>
                            </button>
                            <button
                                className={`${styles.dayButton} ${selectedDay === 'sunday' ? styles.dayButtonActive : ''}`}
                                style={{
                                    backgroundColor: selectedDay === 'sunday' ? '#f093fb' : '#f8f9fa',
                                    color: selectedDay === 'sunday' ? '#fff' : '#666'
                                }}
                                onClick={() => {
                                    setSelectedDay('sunday');
                                    setSelectedBooths([]); // Reset selection on day change
                                }}
                            >
                                <span className={styles.dayIcon}>📅</span>
                                <span className={styles.dayText}>วันอาทิตย์</span>
                                <span className={styles.daySubtext}>เปิดจองพรุ่งนี้</span>
                            </button>
                        </div>

                        {/* Statistics */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#3498db' }}>📊</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.total}</div>
                                    <div className={styles.statLabel}>ทั้งหมด</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#27ae60' }}>✓</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.available}</div>
                                    <div className={styles.statLabel}>ว่าง</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#e74c3c' }}>🔒</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.booked}</div>
                                    <div className={styles.statLabel}>จองแล้ว</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#f39c12' }}>⏳</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.pending}</div>
                                    <div className={styles.statLabel}>รอชำระ</div>
                                </div>
                            </div>
                        </div>

                        {/* Area Map */}
                        <div className={styles.mapSection}>
                            <h2 className={styles.mapTitle}>แผนผังพื้นที่</h2>

                            {/* Zone A */}
                            <div className={styles.zoneSection}>
                                <div className={styles.boothRow}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneA').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneA">
                                        {boothsData.A.map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : '#27ae60',
                                                        backgroundColor: isSelected ? '#3498db' : (booth.status === 'available' ? '#fff' :
                                                            booth.status === 'booked' ? '#fadbd8' : '#fef5e7'),
                                                        color: isSelected ? '#fff' : 'inherit',
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : ''
                                                    }}
                                                    onClick={() => handleBoothClick(booth)}
                                                >
                                                    <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                    <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                    <div
                                                        className={styles.boothStatus}
                                                        style={{ color: getStatusColor(booth.status, isSelected) }}
                                                    >
                                                        {getStatusIcon(booth.status, isSelected)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneA').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>
                            </div>

                            {/* Zone B */}
                            <div className={styles.zoneSection}>
                                <div className={styles.zoneHeader} style={{ backgroundColor: '#95a5a6' }}>
                                    <span>🚶 ทางเดิน</span>
                                </div>

                                <div className={styles.boothRow}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB1').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneB1">
                                        {boothsData.B.slice(0, Math.ceil(boothsData.B.length / 2)).map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : '#f39c12',
                                                        backgroundColor: isSelected ? '#3498db' : (booth.status === 'available' ? '#fff' :
                                                            booth.status === 'booked' ? '#fadbd8' : '#fef5e7'),
                                                        color: isSelected ? '#fff' : 'inherit',
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : ''
                                                    }}
                                                    onClick={() => handleBoothClick(booth)}
                                                >
                                                    <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                    <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                    <div
                                                        className={styles.boothStatus}
                                                        style={{ color: getStatusColor(booth.status, isSelected) }}
                                                    >
                                                        {getStatusIcon(booth.status, isSelected)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB1').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>

                                <div className={styles.boothRow} style={{ marginTop: '12px' }}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB2').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneB2">
                                        {boothsData.B.slice(Math.ceil(boothsData.B.length / 2)).map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : '#f39c12',
                                                        backgroundColor: isSelected ? '#3498db' : (booth.status === 'available' ? '#fff' :
                                                            booth.status === 'booked' ? '#fadbd8' : '#fef5e7'),
                                                        color: isSelected ? '#fff' : 'inherit',
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : ''
                                                    }}
                                                    onClick={() => handleBoothClick(booth)}
                                                >
                                                    <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                    <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                    <div
                                                        className={styles.boothStatus}
                                                        style={{ color: getStatusColor(booth.status, isSelected) }}
                                                    >
                                                        {getStatusIcon(booth.status, isSelected)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB2').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>
                            </div>

                            {/* Zone C */}
                            <div className={styles.zoneSection}>
                                <div className={styles.zoneHeader} style={{ backgroundColor: '#95a5a6' }}>
                                    <span>🚶 ทางเดิน</span>
                                </div>
                                <div className={styles.boothRow}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneC').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneC">
                                        {boothsData.C.map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : '#3498db',
                                                        backgroundColor: isSelected ? '#3498db' : (booth.status === 'available' ? '#fff' :
                                                            booth.status === 'booked' ? '#fadbd8' : '#fef5e7'),
                                                        color: isSelected ? '#fff' : 'inherit',
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : ''
                                                    }}
                                                    onClick={() => handleBoothClick(booth)}
                                                >
                                                    <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                    <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                    <div
                                                        className={styles.boothStatus}
                                                        style={{ color: getStatusColor(booth.status, isSelected) }}
                                                    >
                                                        {getStatusIcon(booth.status, isSelected)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneC').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className={styles.legend}>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ backgroundColor: '#27ae60' }}></span>
                                    <span>สีเขียว: ว่าง (Available)</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ backgroundColor: '#e74c3c' }}></span>
                                    <span>สีแดง: จองแล้ว (Booked)</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ backgroundColor: '#f39c12' }}></span>
                                    <span>สีส้ม: รอชำระ (Pending)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Selected Booths */}
                    <div className={styles.sidebar}>
                        <h3 className={styles.sidebarTitle}>รายการที่เลือก ({selectedBooths.length})</h3>

                        <div className={styles.selectedList}>
                            {selectedBooths.length === 0 ? (
                                <div className={styles.emptySelection}>
                                    ยังไม่ได้เลือกบูธ
                                    <br />
                                    คลิกที่บูธเพื่อเลือก
                                </div>
                            ) : (
                                selectedBooths.map(booth => (
                                    <div key={booth.id} className={styles.selectedItem}>
                                        <div className={styles.selectedItemInfo}>
                                            <span className={styles.selectedItemName}>บูธ {booth.id} ({booth.zone})</span>
                                            <span className={styles.selectedItemPrice}>฿{booth.price.toLocaleString()}</span>
                                        </div>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleBoothClick(booth)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className={styles.sidebarFooter}>
                            <div className={styles.totalPrice}>
                                <span>ยอดรวม</span>
                                <span style={{ color: '#27ae60' }}>฿{getTotalPrice().toLocaleString()}</span>
                            </div>
                            <button
                                className={styles.confirmButton}
                                disabled={selectedBooths.length === 0}
                                style={{ width: '100%', opacity: selectedBooths.length === 0 ? 0.5 : 1, cursor: selectedBooths.length === 0 ? 'not-allowed' : 'pointer' }}
                                onClick={() => {
                                    setBookingStep(1);
                                    setShowBookingModal(true);
                                }}
                            >
                                ยืนยันการจอง
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking Process Modal */}
                {showBookingModal && selectedBooths.length > 0 && (
                    <div className={styles.modal} onClick={() => setShowBookingModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%' }}>
                            {bookingStep === 1 ? (
                                /* Step 1: User Details */
                                <div className={styles.stepContainer}>
                                    <h3 className={styles.stepTitle}>ยืนยันการจอง</h3>

                                    <div className={styles.stepLayout}>
                                        {/* Left: Summary */}
                                        <div className={styles.summarySection}>
                                            <div className={styles.sectionHeader}>
                                                <span>📋</span> สรุปรายการ
                                            </div>

                                            <div className={styles.modalSummaryList}>
                                                {selectedBooths.map(b => (
                                                    <div key={b.id} className={styles.summaryItem}>
                                                        <span>บูธ {b.id} ({b.zone})</span>
                                                        <span>฿{b.price}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={styles.summaryTotal}>
                                                <span>รวมทั้งสิ้น</span>
                                                <span className={styles.summaryTotalValue}>฿{getTotalPrice().toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Right: Form */}
                                        <div className={styles.formSection}>
                                            <div className={styles.sectionHeader}>
                                                <span>👤</span> ข้อมูลผู้จอง
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>ชื่อ-นามสกุล</label>
                                                <input
                                                    type="text"
                                                    value={bookingDetails.name}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                                                    className={styles.inputField}
                                                    placeholder="กรอกชื่อ-นามสกุล"
                                                />
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>อีเมล</label>
                                                <input
                                                    type="email"
                                                    value={bookingDetails.email}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                                                    className={styles.inputField}
                                                    placeholder="กรอกอีเมล"
                                                />
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>เบอร์โทรศัพท์</label>
                                                <input
                                                    type="tel"
                                                    value={bookingDetails.phone}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                                                    className={styles.inputField}
                                                    placeholder="กรอกเบอร์โทรศัพท์"
                                                />
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>วิธีการชำระเงิน</label>
                                                <div className={styles.paymentMethods}>
                                                    <button className={`${styles.paymentButton} ${styles.paymentButtonActive}`}>
                                                        PromptPay
                                                    </button>
                                                    <button className={styles.paymentButton} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                        Credit Card
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.modalButtons} style={{ marginTop: 'auto' }}>
                                                <button className={styles.cancelButton} onClick={() => setShowBookingModal(false)}>ยกเลิก</button>
                                                <button
                                                    className={styles.confirmButton}
                                                    onClick={() => setBookingStep(2)}
                                                    style={{ opacity: (!bookingDetails.name || !bookingDetails.phone) ? 0.5 : 1 }}
                                                    disabled={!bookingDetails.name || !bookingDetails.phone}
                                                >
                                                    ดำเนินการต่อ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Step 2: Payment & Upload */
                                <div className={styles.stepContainer}>
                                    <h3 className={styles.stepTitle}>การชำระเงิน</h3>

                                    <div className={styles.stepLayout}>
                                        {/* Left: Summary */}
                                        <div className={styles.summarySection}>
                                            <div className={styles.sectionHeader}>
                                                <span>💰</span> รายละเอียดการชำระ
                                            </div>

                                            <div style={{ marginBottom: '24px' }}>
                                                <div className={styles.summaryItem}>
                                                    <span>จำนวนบูธที่จอง</span>
                                                    <span style={{ fontWeight: 'bold' }}>{selectedBooths.length} บูธ</span>
                                                </div>
                                                <div className={styles.summaryTotal}>
                                                    <span>ยอดชำระเงิน</span>
                                                    <span className={styles.summaryTotalValue}>฿{getTotalPrice().toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Bank Details Card */}
                                            <div className={styles.bankCard}>
                                                <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                                    <img
                                                        src="/img/promptpay.png"
                                                        alt="PromptPay QR Code"
                                                        style={{ width: '100%', maxWidth: '220px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                                    />
                                                    <div style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>สแกนเพื่อชำระเงิน</div>
                                                </div>
                                                <div className={styles.bankHeader}>
                                                    <div className={styles.bankIcon}>🏦</div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>ธนาคารกรุงไทย</div>
                                                        <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Walking Street Market</div>
                                                    </div>
                                                </div>
                                                <div className={styles.accountNumber}>115-x-xxxxx-x</div>
                                                <div className={styles.accountName}>ชื่อบัญชี: แพลนเน็ท เทศวินทร์</div>
                                            </div>
                                        </div>

                                        {/* Right: Upload Slip */}
                                        <div className={styles.formSection} style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div className={styles.sectionHeader}>
                                                <span>🧾</span> หลักฐานการโอน
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <label className={styles.inputLabel} style={{ marginBottom: '8px', display: 'block' }}>ระบุจำนวนเงินที่โอน</label>
                                                <input
                                                    type="number"
                                                    value={paymentAmount}
                                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                                    className={styles.inputField}
                                                    placeholder="0.00"
                                                    style={{ width: '100%' }}
                                                />
                                            </div>


                                            <label className={styles.uploadBox}>
                                                <input
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {uploadPreview ? (
                                                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                                        <img
                                                            src={uploadPreview}
                                                            alt="Slip Preview"
                                                            style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'contain' }}
                                                        />

                                                        {isVerifyingSlip && (
                                                            <div style={{ marginTop: '8px', color: '#f39c12' }}>⏳ กำลังตรวจสอบสลิป...</div>
                                                        )}

                                                        {!isVerifyingSlip && slipVerificationStatus === 'success' && (
                                                            <div style={{ marginTop: '8px', color: '#2ecc71', fontWeight: 'bold' }}>✅ พบยอดเงินถูกต้อง</div>
                                                        )}

                                                        {!isVerifyingSlip && slipVerificationStatus === 'failed' && (
                                                            <div style={{ marginTop: '8px', color: '#e74c3c' }}>⚠️ ไม่พบยอดเงินที่ตรงกัน (กรุณาตรวจสอบ)</div>
                                                        )}

                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '10px',
                                                            background: 'rgba(0,0,0,0.6)',
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px'
                                                        }}>
                                                            คลิกเพื่อเปลี่ยนรูป
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className={styles.uploadIcon}>☁️</div>
                                                        <div className={styles.uploadText}>อัปโหลดสลิปโอนเงิน</div>
                                                        <div className={styles.uploadHint}>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</div>
                                                    </>
                                                )}
                                            </label>

                                            <div className={styles.modalButtons} style={{ marginTop: '24px' }}>
                                                <button className={styles.cancelButton} onClick={() => setBookingStep(1)}>ย้อนกลับ</button>
                                                <button
                                                    className={styles.confirmButton}
                                                    onClick={() => {
                                                        const total = getTotalPrice();
                                                        if (parseFloat(paymentAmount) !== total) {
                                                            alert(`ยอดเงินไม่ถูกต้อง กรุณาระบุจำนวนเงินให้ตรงกับยอดชำระ (${total.toLocaleString()} บาท)`);
                                                            return;
                                                        }

                                                        if (!uploadPreview) {
                                                            alert('กรุณาแนบหลักฐานการโอนเงิน');
                                                            return;
                                                        }

                                                        if (slipVerificationStatus === 'failed') {
                                                            const confirm = window.confirm('ระบบไม่พบยอดเงินที่ตรงกันในสลิป คุณยืนยันที่จะส่งข้อมูลหรือไม่?');
                                                            if (!confirm) return;
                                                        }

                                                        // Add to my bookings
                                                        const newBookings = selectedBooths.map(b => b.id);
                                                        setMyBookings(prev => [...prev, ...newBookings]);

                                                        // Clear state
                                                        setUploadPreview(null);
                                                        setPaymentAmount('');
                                                        alert('จองสำเร็จ! กรุณารอการตรวจสอบ');
                                                        setShowBookingModal(false);
                                                        setSelectedBooths([]);
                                                    }}
                                                >
                                                    แจ้งชำระเงิน
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Limit Warning Modal */}
                {showLimitModal && (
                    <div className={styles.modal} onClick={() => setShowLimitModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                            <h3 style={{ color: '#e74c3c' }}>แจ้งเตือน</h3>
                            <p style={{ margin: '16px 0', fontSize: '16px' }}>คุณสามารถเลือกจองได้สูงสุด 3 บูธต่อครั้งเท่านั้น</p>
                            <button
                                className={styles.confirmButton}
                                onClick={() => setShowLimitModal(false)}
                                style={{ width: '100%', marginTop: '8px' }}
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Load Tesseract.js from CDN */}
            <Script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js" strategy="lazyOnload" />
        </div >
    );
}

export default function BookingsPage() {
    return (
        <MarketAuthProvider>
            <ProtectedRoute>
                <BookingsContent />
            </ProtectedRoute>
        </MarketAuthProvider>
    );
}
