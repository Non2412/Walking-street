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
    const [selectedBooths, setSelectedBooths] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

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
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.container}>
                <div className={styles.layoutWrapper}>
                    <div className={styles.mainContent}>
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
                                onClick={() => setShowBookingModal(true)}
                            >
                                ยืนยันการจอง
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking Confirmation Modal */}
                {showBookingModal && selectedBooths.length > 0 && (
                    <div className={styles.modal} onClick={() => setShowBookingModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <h3>ยืนยันการจอง</h3>
                            <p>คุณต้องการยืนยันการจองบูธจำนวน {selectedBooths.length} รายการ?</p>

                            <div style={{ maxHeight: '150px', overflowY: 'auto', margin: '16px 0', border: '1px solid #eee', padding: '8px', borderRadius: '8px' }}>
                                {selectedBooths.map(b => (
                                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f5f5f5' }}>
                                        <span>บูธ {b.id}</span>
                                        <span>฿{b.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', margin: '16px 0' }}>
                                <span>ยอดรวมทั้งหมด</span>
                                <span style={{ color: '#27ae60' }}>฿{getTotalPrice().toLocaleString()}</span>
                            </div>

                            <div className={styles.modalButtons}>
                                <button className={styles.confirmButton} onClick={() => alert('ดำเนินการจองเรียบร้อย!')}>ยืนยันการชำระเงิน</button>
                                <button className={styles.cancelButton} onClick={() => setShowBookingModal(false)}>ยกเลิก</button>
                            </div>
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
