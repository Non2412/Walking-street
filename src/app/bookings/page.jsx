/**
 * Bookings Page - หน้าจัดการการจองพื้นที่
 * แสดงแผนผังบูธแบบ Visual
 */

'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

function BookingsContent() {
    const [selectedZone, setSelectedZone] = useState('A');
    const [selectedBooth, setSelectedBooth] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Mock booth data - สถานะของแต่ละบูธ
    const boothsData = {
        A: [
            { id: 'A-01', status: 'available', price: 500 },
            { id: 'A-02', status: 'booked', price: 500, bookedBy: 'ร้านอาหารไทย' },
            { id: 'A-03', status: 'available', price: 500 },
            { id: 'A-04', status: 'available', price: 500 },
            { id: 'A-05', status: 'booked', price: 500, bookedBy: 'ร้านกาแฟ' },
            { id: 'A-06', status: 'available', price: 500 },
            { id: 'A-07', status: 'available', price: 500 },
            { id: 'A-08', status: 'pending', price: 500, bookedBy: 'ร้านขนมหวาน' },
            { id: 'A-09', status: 'available', price: 500 },
            { id: 'A-10', status: 'available', price: 500 },
            { id: 'A-11', status: 'booked', price: 500, bookedBy: 'ร้านเสื้อผ้า' },
            { id: 'A-12', status: 'available', price: 500 },
        ],
        B: [
            { id: 'B-01', status: 'available', price: 800 },
            { id: 'B-02', status: 'available', price: 800 },
            { id: 'B-03', status: 'booked', price: 800, bookedBy: 'ร้านของเล่น' },
            { id: 'B-04', status: 'available', price: 800 },
            { id: 'B-05', status: 'booked', price: 800, bookedBy: 'ร้านเครื่องดื่ม' },
            { id: 'B-06', status: 'available', price: 800 },
            { id: 'B-07', status: 'available', price: 800 },
            { id: 'B-08', status: 'available', price: 800 },
        ],
        C: [
            { id: 'C-01', status: 'available', price: 600 },
            { id: 'C-02', status: 'available', price: 600 },
            { id: 'C-03', status: 'available', price: 600 },
            { id: 'C-04', status: 'booked', price: 600, bookedBy: 'ร้านอาหารญี่ปุ่น' },
            { id: 'C-05', status: 'available', price: 600 },
            { id: 'C-06', status: 'available', price: 600 },
            { id: 'C-07', status: 'pending', price: 600, bookedBy: 'ร้านไอศกรีม' },
            { id: 'C-08', status: 'available', price: 600 },
            { id: 'C-09', status: 'available', price: 600 },
            { id: 'C-10', status: 'available', price: 600 },
        ],
    };

    const zones = [
        { id: 'A', name: 'โซน A', color: '#667eea', description: 'บริเวณหน้าตลาด' },
        { id: 'B', name: 'โซน B', color: '#f093fb', description: 'บริเวณกลางตลาด' },
        { id: 'C', name: 'โซน C', color: '#4facfe', description: 'บริเวณท้ายตลาด' },
    ];

    const getBoothStyle = (status) => {
        const baseStyle = {
            available: { bg: '#e8f8f5', border: '#27ae60', color: '#27ae60' },
            booked: { bg: '#fadbd8', border: '#e74c3c', color: '#e74c3c' },
            pending: { bg: '#fef5e7', border: '#f39c12', color: '#f39c12' },
        };
        return baseStyle[status] || baseStyle.available;
    };

    const handleBoothClick = (booth) => {
        if (booth.status === 'available') {
            setSelectedBooth(booth);
            setShowBookingModal(true);
        }
    };

    const currentBooths = boothsData[selectedZone] || [];
    const stats = {
        total: currentBooths.length,
        available: currentBooths.filter(b => b.status === 'available').length,
        booked: currentBooths.filter(b => b.status === 'booked').length,
        pending: currentBooths.filter(b => b.status === 'pending').length,
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>🏪 จองพื้นที่ขายของ</h1>
                        <p className={styles.subtitle}>เลือกบูธที่ต้องการจอง</p>
                    </div>
                </div>

                {/* Zone Selector */}
                <div className={styles.zoneSelector}>
                    {zones.map((zone) => (
                        <button
                            key={zone.id}
                            onClick={() => setSelectedZone(zone.id)}
                            className={`${styles.zoneButton} ${selectedZone === zone.id ? styles.zoneButtonActive : ''}`}
                            style={selectedZone === zone.id ?
                                { borderColor: zone.color, backgroundColor: zone.color } :
                                { borderColor: zone.color }
                            }
                        >
                            <div className={styles.zoneName}>{zone.name}</div>
                            <div className={styles.zoneDesc}>{zone.description}</div>
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📊</div>
                        <div>
                            <div className={styles.statValue}>{stats.total}</div>
                            <div className={styles.statLabel}>ทั้งหมด</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#e8f8f5', color: '#27ae60' }}>✅</div>
                        <div>
                            <div className={styles.statValue}>{stats.available}</div>
                            <div className={styles.statLabel}>ว่าง</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#fadbd8', color: '#e74c3c' }}>🔒</div>
                        <div>
                            <div className={styles.statValue}>{stats.booked}</div>
                            <div className={styles.statLabel}>จองแล้ว</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#fef5e7', color: '#f39c12' }}>⏳</div>
                        <div>
                            <div className={styles.statValue}>{stats.pending}</div>
                            <div className={styles.statLabel}>รออนุมัติ</div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendBox} style={{ ...getBoothStyle('available') }}></div>
                        <span>ว่าง (คลิกเพื่อจอง)</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendBox} style={{ ...getBoothStyle('booked') }}></div>
                        <span>จองแล้ว</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendBox} style={{ ...getBoothStyle('pending') }}></div>
                        <span>รออนุมัติ</span>
                    </div>
                </div>

                {/* Booth Map */}
                <div className={styles.boothMapCard}>
                    <h2 className={styles.mapTitle}>แผนผังบูธ - {zones.find(z => z.id === selectedZone)?.name}</h2>
                    <div className={styles.boothGrid}>
                        {currentBooths.map((booth) => {
                            const boothStyle = getBoothStyle(booth.status);
                            return (
                                <div
                                    key={booth.id}
                                    onClick={() => handleBoothClick(booth)}
                                    className={styles.boothBox}
                                    style={{
                                        backgroundColor: boothStyle.bg,
                                        borderColor: boothStyle.border,
                                        cursor: booth.status === 'available' ? 'pointer' : 'not-allowed',
                                        opacity: booth.status === 'available' ? 1 : 0.7,
                                    }}
                                    title={booth.status === 'available' ? 'คลิกเพื่อจอง' : booth.bookedBy}
                                >
                                    <div className={styles.boothId} style={{ color: boothStyle.color }}>{booth.id}</div>
                                    <div className={styles.boothPrice}>฿{booth.price}</div>
                                    {booth.status !== 'available' && (
                                        <div className={styles.boothStatus}>
                                            {booth.status === 'booked' ? '🔒' : '⏳'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Booking Modal */}
                {showBookingModal && selectedBooth && (
                    <div className={styles.modalOverlay} onClick={() => setShowBookingModal(false)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.modalTitle}>📝 จองบูธ {selectedBooth.id}</h2>
                            <div className={styles.modalContent}>
                                <div className={styles.modalRow}>
                                    <span className={styles.modalLabel}>โซน:</span>
                                    <span className={styles.modalValue}>{zones.find(z => z.id === selectedZone)?.name}</span>
                                </div>
                                <div className={styles.modalRow}>
                                    <span className={styles.modalLabel}>บูธ:</span>
                                    <span className={styles.modalValue}>{selectedBooth.id}</span>
                                </div>
                                <div className={styles.modalRow}>
                                    <span className={styles.modalLabel}>ค่าเช่า:</span>
                                    <span className={styles.modalValue} style={{ color: '#27ae60', fontWeight: 'bold' }}>
                                        ฿{selectedBooth.price}
                                    </span>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>ชื่อร้าน:</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="กรอกชื่อร้าน"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>วันที่เข้าขาย:</label>
                                    <input
                                        type="date"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>หมายเหตุ:</label>
                                    <textarea
                                        className={`${styles.input} ${styles.textarea}`}
                                        placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                                    ></textarea>
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.cancelButton} onClick={() => setShowBookingModal(false)}>
                                    ยกเลิก
                                </button>
                                <button className={styles.confirmButton}>
                                    ✅ ยืนยันการจอง
                                </button>
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
