/**
 * BookingList Component
 * แสดงรายการการจองทั้งหมด พร้อมฟังก์ชันจัดการ
 */

'use client';

import { useBookings } from '../hooks/useBookings';
import {
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_COLORS,
    SHOP_TYPE_LABELS,
    formatDate,
    formatDateTime
} from '../types/booking';

export default function BookingList({ filterStatus = null, filterShopType = null }) {
    const { bookings, loading, error, updateBookingStatus, deleteBooking } = useBookings();

    // กรองข้อมูลตามเงื่อนไข
    const filteredBookings = bookings.filter(booking => {
        if (filterStatus && booking.status !== filterStatus) return false;
        if (filterShopType && booking.shopType !== filterShopType) return false;
        return true;
    });

    const handleApprove = async (id) => {
        if (confirm('ต้องการอนุมัติการจองนี้?')) {
            try {
                await updateBookingStatus(id, 'approved');
                alert('อนุมัติสำเร็จ');
            } catch (err) {
                alert('เกิดข้อผิดพลาด: ' + err.message);
            }
        }
    };

    const handleReject = async (id) => {
        if (confirm('ต้องการปฏิเสธการจองนี้?')) {
            try {
                await updateBookingStatus(id, 'rejected');
                alert('ปฏิเสธสำเร็จ');
            } catch (err) {
                alert('เกิดข้อผิดพลาด: ' + err.message);
            }
        }
    };

    const handleDelete = async (id) => {
        if (confirm('ต้องการลบการจองนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
            try {
                await deleteBooking(id);
                alert('ลบสำเร็จ');
            } catch (err) {
                alert('เกิดข้อผิดพลาด: ' + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                <p>❌ เกิดข้อผิดพลาด: {error}</p>
            </div>
        );
    }

    if (filteredBookings.length === 0) {
        return (
            <div style={styles.empty}>
                <p>ไม่พบข้อมูลการจอง</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>รายการจอง ({filteredBookings.length})</h2>

            <div style={styles.grid}>
                {filteredBookings.map((booking) => (
                    <div key={booking._id} style={styles.card}>
                        {/* Header */}
                        <div style={styles.cardHeader}>
                            <h3 style={styles.storeName}>{booking.storeName}</h3>
                            <span
                                style={{
                                    ...styles.statusBadge,
                                    backgroundColor: BOOKING_STATUS_COLORS[booking.status],
                                }}
                            >
                                {BOOKING_STATUS_LABELS[booking.status]}
                            </span>
                        </div>

                        {/* Body */}
                        <div style={styles.cardBody}>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>เจ้าของ:</span>
                                <span>{booking.ownerName}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.label}>โทร:</span>
                                <span>{booking.phone}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.label}>อีเมล:</span>
                                <span>{booking.email}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.label}>ประเภท:</span>
                                <span>{SHOP_TYPE_LABELS[booking.shopType]}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.label}>พื้นที่:</span>
                                <span style={styles.stallNumber}>{booking.stallNumber}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <span style={styles.label}>วันที่จอง:</span>
                                <span>{formatDate(booking.bookingDate)}</span>
                            </div>

                            {booking.notes && (
                                <div style={styles.notes}>
                                    <span style={styles.label}>หมายเหตุ:</span>
                                    <p>{booking.notes}</p>
                                </div>
                            )}

                            <div style={styles.timestamp}>
                                สร้างเมื่อ: {formatDateTime(booking.createdAt)}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={styles.actions}>
                            {booking.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(booking._id)}
                                        style={{ ...styles.button, ...styles.approveButton }}
                                    >
                                        ✓ อนุมัติ
                                    </button>
                                    <button
                                        onClick={() => handleReject(booking._id)}
                                        style={{ ...styles.button, ...styles.rejectButton }}
                                    >
                                        ✗ ปฏิเสธ
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleDelete(booking._id)}
                                style={{ ...styles.button, ...styles.deleteButton }}
                            >
                                🗑️ ลบ
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: '#666',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    error: {
        padding: '20px',
        backgroundColor: '#fee',
        color: '#c33',
        borderRadius: '8px',
        margin: '20px',
    },
    empty: {
        padding: '40px',
        textAlign: 'center',
        color: '#999',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    cardHeader: {
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storeName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: 0,
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    cardBody: {
        padding: '16px',
    },
    infoRow: {
        display: 'flex',
        marginBottom: '8px',
        fontSize: '14px',
    },
    label: {
        fontWeight: 'bold',
        marginRight: '8px',
        color: '#666',
        minWidth: '80px',
    },
    stallNumber: {
        fontWeight: 'bold',
        color: '#3498db',
    },
    notes: {
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '14px',
    },
    timestamp: {
        marginTop: '12px',
        fontSize: '12px',
        color: '#999',
    },
    actions: {
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        gap: '8px',
    },
    button: {
        flex: 1,
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
    },
    rejectButton: {
        backgroundColor: '#F44336',
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#666',
        color: '#fff',
    },
};
