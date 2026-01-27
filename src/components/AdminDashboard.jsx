'use client';

import { useState, useEffect } from 'react';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import BookingDetail from './BookingDetail';
import styles from './admin-dashboard.module.css';

export default function AdminDashboard() {
    const { token, loading: authLoading } = useMarketAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    // Fetch on mount AND when token changes
    useEffect(() => {
        // Always try to fetch - use token from context or localStorage
        if (!hasFetched) {
            console.log('🔄 AdminDashboard mounted - fetching bookings');
            fetchBookings();
            setHasFetched(true);
        }
    }, []);

    // Also fetch if token becomes available
    useEffect(() => {
        if (token && !authLoading) {
            console.log('✅ Token available from context - fetching bookings');
            fetchBookings();
        }
    }, [token, authLoading]);

    const fetchBookings = async () => {
        // Use context token first, then fallback to localStorage
        let authToken = token;
        if (!authToken) {
            authToken = localStorage.getItem('market_token');
            console.log('🔑 Using token from localStorage:', !!authToken);
        }
        
        if (!authToken) {
            console.warn('⚠️ Token not available - cannot fetch bookings');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            console.log('🔄 Fetching bookings from local proxy');
            console.log('📌 Token exists:', !!authToken);
            console.log('📌 Token preview:', authToken.substring(0, 30) + '...');
            
            const response = await fetch('/api/bookings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            console.log('📊 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Response data:', data);
            console.log('📊 Bookings count:', data.data?.length || 0);

            if (data.success && data.data) {
                setBookings(data.data);
                console.log('✅ Bookings set to state:', data.data.length);
            } else if (Array.isArray(data)) {
                // If API return array directly
                setBookings(data);
                console.log('✅ Direct array set:', data.length);
            } else {
                console.warn('⚠️ Unexpected response format:', data);
            }
        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking =>
        !filterStatus || booking.status === filterStatus
    );

    // Stats
    const stats = [
        {
            label: 'รวมการจอง',
            value: bookings.length,
            icon: '📋',
            color: '#3498db',
        },
        {
            label: 'รอการอนุมัติ',
            value: bookings.filter(b => b.status === 'pending').length,
            icon: '⏳',
            color: '#f39c12',
        },
        {
            label: 'อนุมัติแล้ว',
            value: bookings.filter(b => b.status === 'approved').length,
            icon: '✅',
            color: '#27ae60',
        },
        {
            label: 'ปฏิเสธ',
            value: bookings.filter(b => b.status === 'rejected').length,
            icon: '❌',
            color: '#e74c3c',
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f39c12';
            case 'approved': return '#27ae60';
            case 'rejected': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    const handleUpdateBooking = (updatedBooking) => {
        setBookings(prev => prev.map(b =>
            b._id === updatedBooking._id ? updatedBooking : b
        ));
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                <p>กำลังโหลดแดชบอร์ดผู้ดูแลระบบ...</p>
            </div>
        );
    }

    return (
        <div style={{ 
            width: '100%',
            padding: '20px',
            background: '#f5f7fa',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#333' }}>
                    📊 แดชบอร์ดผู้ดูแลระบบ
                </h1>
                <button 
                    onClick={fetchBookings}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    🔄 รีเฟรช
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <div style={{
                            fontSize: '36px',
                            width: '60px',
                            height: '60px',
                            background: `${stat.color}20`,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ margin: '0 0 5px 0', color: '#999', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                                {stat.label}
                            </p>
                            <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: stat.color }}>
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">สถานะทั้งหมด</option>
                    <option value="pending">รอการอนุมัติ</option>
                    <option value="approved">อนุมัติแล้ว</option>
                    <option value="rejected">ปฏิเสธ</option>
                </select>
            </div>

            {/* Bookings Table */}
            <div className={styles.tableSection}>
                {filteredBookings.length === 0 ? (
                    <div className={styles.empty}>
                        <p>ไม่พบการจอง</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ชื่อร้าน</th>
                                    <th>เจ้าของ</th>
                                    <th>เบอร์โทร</th>
                                    <th>ประเภท</th>
                                    <th>หมายเลขสถาน</th>
                                    <th>สถานะ</th>
                                    <th>การกระทำ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className={styles.storeName}>{booking.storeName}</td>
                                        <td>{booking.ownerName}</td>
                                        <td>{booking.phone}</td>
                                        <td>{booking.shopType}</td>
                                        <td>{booking.stallNumber}</td>
                                        <td>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    backgroundColor: getStatusColor(booking.status) + '20',
                                                    color: getStatusColor(booking.status),
                                                }}
                                            >
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => setSelectedBooking(booking._id)}
                                            >
                                                👁️ ดู
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedBooking && (
                <div className={styles.modal} onClick={() => setSelectedBooking(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <BookingDetail
                            bookingId={selectedBooking}
                            onClose={() => setSelectedBooking(null)}
                            onUpdate={handleUpdateBooking}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
