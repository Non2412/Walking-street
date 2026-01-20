'use client';

import { useState, useEffect } from 'react';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import BookingDetail from './BookingDetail';
import styles from './admin-dashboard.module.css';

export default function AdminDashboard() {
    const { token } = useMarketAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app';

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            console.log('🔄 Fetching bookings from:', API_BASE_URL);
            console.log('📌 Token available:', !!token);
            
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
            });

            console.log('📊 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Data received:', data);

            if (data.success) {
                setBookings(data.data || []);
            } else if (Array.isArray(data)) {
                // ถ้า API return array โดยตรง
                setBookings(data);
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
            label: 'Total Bookings',
            value: bookings.length,
            icon: '📋',
            color: '#3498db',
        },
        {
            label: 'Pending',
            value: bookings.filter(b => b.status === 'pending').length,
            icon: '⏳',
            color: '#f39c12',
        },
        {
            label: 'Approved',
            value: bookings.filter(b => b.status === 'approved').length,
            icon: '✅',
            color: '#27ae60',
        },
        {
            label: 'Rejected',
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
        return <div className={styles.loading}>Loading admin dashboard...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Admin Dashboard</h1>
                <button className={styles.refreshBtn} onClick={fetchBookings}>
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                {stats.map((stat, idx) => (
                    <div key={idx} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>{stat.label}</p>
                            <p className={styles.statValue} style={{ color: stat.color }}>
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className={styles.filterSection}>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Bookings Table */}
            <div className={styles.tableSection}>
                {filteredBookings.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No bookings found</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Store Name</th>
                                    <th>Owner</th>
                                    <th>Phone</th>
                                    <th>Shop Type</th>
                                    <th>Stall</th>
                                    <th>Status</th>
                                    <th>Actions</th>
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
                                                👁️ View
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
