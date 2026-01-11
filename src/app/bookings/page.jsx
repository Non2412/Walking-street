/**
 * Bookings Page - หน้าจัดการการจองพื้นที่
 * แสดงแผนผังบูธแบบแถวนอน (Horizontal Rows)
 */

'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

function BookingsContent() {
    const [selectedDay, setSelectedDay] = useState('saturday'); // saturday or sunday
    const [selectedBooth, setSelectedBooth] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

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
            booths.A.push({
                id,
                zone: 'A',
                price: 500,
                status: rand > 7 ? (rand > 8 ? 'booked' : 'pending') : 'available',
                bookedBy: rand > 5 ? 'ร้านตัวอย่าง' : null,
            });
        }

        // Zone B (฿700)
        for (let i = 1; i <= counts.B; i++) {
            const id = `B-${String(i).padStart(2, '0')}`;
            const rand = (i * 11) % 10;
            booths.B.push({
                id,
                zone: 'B',
                price: 700,
                status: rand > 7 ? (rand > 8 ? 'booked' : 'pending') : 'available',
                bookedBy: rand > 5 ? 'ร้านตัวอย่าง' : null,
            });
        }

        // Zone C (฿1000)
        for (let i = 1; i <= counts.C; i++) {
            const id = `C-${String(i).padStart(2, '0')}`;
            const rand = (i * 13) % 10;
            booths.C.push({
                id,
                zone: 'C',
                price: 1000,
                status: rand > 7 ? (rand > 8 ? 'booked' : 'pending') : 'available',
                bookedBy: rand > 5 ? 'ร้านตัวอย่าง' : null,
            });
        }

        return booths;
    }, [selectedDay]);

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
            setSelectedBooth(booth);
            setShowBookingModal(true);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'available': return '✓';
            case 'booked': return '🔒';
            case 'pending': return '⏳';
            default: return '';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return '#27ae60';
            case 'booked': return '#e74c3c';
            case 'pending': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>🏪 จองพื้นที่ขายของ</h1>
                    <p className={styles.subtitle}>เลือกวันและบูธที่ต้องการจอง</p>
                </div>

                {/* Day Selection */}
                <div className={styles.dayButtons}>
                    <button
                        className={`${styles.dayButton} ${selectedDay === 'saturday' ? styles.dayButtonActive : ''}`}
                        style={{
                            backgroundColor: selectedDay === 'saturday' ? '#667eea' : '#f8f9fa',
                            color: selectedDay === 'saturday' ? '#fff' : '#666'
                        }}
                        onClick={() => setSelectedDay('saturday')}
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
                        onClick={() => setSelectedDay('sunday')}
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

                    {/* Zone A - 1 แถว */}
                    <div className={styles.zoneSection}>
                        <div className={styles.boothRow}>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneA').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                            )}
                            <div className={styles.boothScroll} id="zoneA">
                                {boothsData.A.map(booth => (
                                    <div
                                        key={booth.id}
                                        className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                        style={{
                                            borderColor: '#27ae60',
                                            backgroundColor: booth.status === 'available' ? '#fff' :
                                                booth.status === 'booked' ? '#fadbd8' : '#fef5e7'
                                        }}
                                        onClick={() => handleBoothClick(booth)}
                                    >
                                        <div className={styles.boothNumber}>{booth.id}</div>
                                        <div className={styles.boothPrice}>฿{booth.price}</div>
                                        <div
                                            className={styles.boothStatus}
                                            style={{ color: getStatusColor(booth.status) }}
                                        >
                                            {getStatusIcon(booth.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneA').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                            )}
                        </div>
                    </div>

                    {/* Zone B - 2 แถว */}
                    <div className={styles.zoneSection} style={selectedDay === 'saturday' ? { width: 'fit-content', display: 'flex', flexDirection: 'column' } : {}}>
                        <div className={styles.zoneHeader} style={{ backgroundColor: '#f39c12', width: '100%' }}>
                            <span>🚶 ทางเดิน</span>
                        </div>
                        {/* แถวที่ 1: ครึ่งแรกของ Zone B */}
                        <div className={styles.boothRow}>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB1').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                            )}
                            <div className={styles.boothScroll} id="zoneB1">
                                {boothsData.B.slice(0, Math.ceil(boothsData.B.length / 2)).map(booth => (
                                    <div
                                        key={booth.id}
                                        className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                        style={{
                                            borderColor: '#f39c12',
                                            backgroundColor: booth.status === 'available' ? '#fff' :
                                                booth.status === 'booked' ? '#fadbd8' : '#fef5e7'
                                        }}
                                        onClick={() => handleBoothClick(booth)}
                                    >
                                        <div className={styles.boothNumber}>{booth.id}</div>
                                        <div className={styles.boothPrice}>฿{booth.price}</div>
                                        <div
                                            className={styles.boothStatus}
                                            style={{ color: getStatusColor(booth.status) }}
                                        >
                                            {getStatusIcon(booth.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB1').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                            )}
                        </div>

                        {/* แถวที่ 2: ครึ่งหลังของ Zone B */}
                        <div className={styles.boothRow} style={{ marginTop: '12px' }}>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB2').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                            )}
                            <div className={styles.boothScroll} id="zoneB2">
                                {boothsData.B.slice(Math.ceil(boothsData.B.length / 2)).map(booth => (
                                    <div
                                        key={booth.id}
                                        className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                        style={{
                                            borderColor: '#f39c12',
                                            backgroundColor: booth.status === 'available' ? '#fff' :
                                                booth.status === 'booked' ? '#fadbd8' : '#fef5e7'
                                        }}
                                        onClick={() => handleBoothClick(booth)}
                                    >
                                        <div className={styles.boothNumber}>{booth.id}</div>
                                        <div className={styles.boothPrice}>฿{booth.price}</div>
                                        <div
                                            className={styles.boothStatus}
                                            style={{ color: getStatusColor(booth.status) }}
                                        >
                                            {getStatusIcon(booth.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB2').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                            )}
                        </div>
                    </div>

                    {/* Zone C - 1 แถว */}
                    <div className={styles.zoneSection} style={selectedDay === 'saturday' ? { width: 'fit-content', display: 'flex', flexDirection: 'column' } : {}}>
                        <div className={styles.zoneHeader} style={{ backgroundColor: '#3498db', width: '100%' }}>
                            <span>🚶 ทางเดิน</span>
                        </div>
                        <div className={styles.boothRow}>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneC').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                            )}
                            <div className={styles.boothScroll} id="zoneC">
                                {boothsData.C.map(booth => (
                                    <div
                                        key={booth.id}
                                        className={`${styles.boothCard} ${booth.status === 'available' ? styles.boothAvailable : ''}`}
                                        style={{
                                            borderColor: '#3498db',
                                            backgroundColor: booth.status === 'available' ? '#fff' :
                                                booth.status === 'booked' ? '#fadbd8' : '#fef5e7'
                                        }}
                                        onClick={() => handleBoothClick(booth)}
                                    >
                                        <div className={styles.boothNumber}>{booth.id}</div>
                                        <div className={styles.boothPrice}>฿{booth.price}</div>
                                        <div
                                            className={styles.boothStatus}
                                            style={{ color: getStatusColor(booth.status) }}
                                        >
                                            {getStatusIcon(booth.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedDay !== 'saturday' && (
                                <button className={styles.scrollButton} onClick={() => document.getElementById('zoneC').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                            )}
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

                {/* Booking Modal */}
                {showBookingModal && selectedBooth && (
                    <div className={styles.modal} onClick={() => setShowBookingModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <h3>จองบูธ {selectedBooth.id}</h3>
                            <p>ราคา: ฿{selectedBooth.price}</p>
                            <p>โซน: {selectedBooth.zone}</p>
                            <div className={styles.modalButtons}>
                                <button className={styles.confirmButton}>ยืนยันการจอง</button>
                                <button className={styles.cancelButton} onClick={() => setShowBookingModal(false)}>ยกเลิก</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BookingsPage() {
    return (
        <ProtectedRoute>
            <BookingsContent />
        </ProtectedRoute>
    );
}
