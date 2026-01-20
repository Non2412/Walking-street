'use client';

import { useState, useEffect } from 'react';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import styles from './booking-list.module.css';

export default function BookingList() {
    const { token } = useMarketAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterShopType, setFilterShopType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app';
    const itemsPerPage = 10;

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
            });

            const data = await response.json();

            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = !filterStatus || booking.status === filterStatus;
        const matchesType = !filterShopType || booking.shopType === filterShopType;
        const matchesSearch = !searchTerm || 
            booking.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesType && matchesSearch;
    });

    const paginatedBookings = filteredBookings.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f39c12';
            case 'approved': return '#27ae60';
            case 'rejected': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading bookings...</div>;
    }

    return (
        <div className={styles.container}>
            <h2>My Bookings</h2>

            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by store or owner name..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    className={styles.searchInput}
                />

                <select
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setPage(1);
                    }}
                    className={styles.filterSelect}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                <select
                    value={filterShopType}
                    onChange={(e) => {
                        setFilterShopType(e.target.value);
                        setPage(1);
                    }}
                    className={styles.filterSelect}
                >
                    <option value="">All Types</option>
                    <option value="food">Food</option>
                    <option value="clothing">Clothing</option>
                    <option value="goods">Goods</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {filteredBookings.length === 0 ? (
                <div className={styles.empty}>
                    <p>No bookings found</p>
                </div>
            ) : (
                <>
                    <div className={styles.bookingsList}>
                        {paginatedBookings.map((booking) => (
                            <div key={booking._id} className={styles.bookingCard}>
                                <div className={styles.cardHeader}>
                                    <h3>{booking.storeName}</h3>
                                    <span
                                        className={styles.status}
                                        style={{
                                            backgroundColor: getStatusColor(booking.status) + '20',
                                            color: getStatusColor(booking.status),
                                        }}
                                    >
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className={styles.cardBody}>
                                    <p><strong>Owner:</strong> {booking.ownerName}</p>
                                    <p><strong>Phone:</strong> {booking.phone}</p>
                                    <p><strong>Email:</strong> {booking.email}</p>
                                    <p><strong>Type:</strong> {booking.shopType}</p>
                                    <p><strong>Stall:</strong> {booking.stallNumber}</p>
                                    <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString('th-TH')}</p>
                                </div>

                                <div className={styles.cardFooter}>
                                    <button
                                        className={styles.detailBtn}
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        👁️ View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className={styles.paginationBtn}
                            >
                                ← Previous
                            </button>
                            <span className={styles.pageInfo}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className={styles.paginationBtn}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Detail Modal */}
            {selectedBooking && (
                <div className={styles.modal} onClick={() => setSelectedBooking(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedBooking(null)}
                        >
                            ✕
                        </button>

                        <h3>{selectedBooking.storeName}</h3>
                        <div className={styles.detailGrid}>
                            <div>
                                <strong>Owner Name:</strong>
                                <p>{selectedBooking.ownerName}</p>
                            </div>
                            <div>
                                <strong>Phone:</strong>
                                <p>{selectedBooking.phone}</p>
                            </div>
                            <div>
                                <strong>Email:</strong>
                                <p>{selectedBooking.email}</p>
                            </div>
                            <div>
                                <strong>Shop Type:</strong>
                                <p>{selectedBooking.shopType}</p>
                            </div>
                            <div>
                                <strong>Stall Number:</strong>
                                <p>{selectedBooking.stallNumber}</p>
                            </div>
                            <div>
                                <strong>Booking Date:</strong>
                                <p>{new Date(selectedBooking.bookingDate).toLocaleDateString('th-TH')}</p>
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <p>
                                    <span
                                        style={{
                                            backgroundColor: getStatusColor(selectedBooking.status) + '20',
                                            color: getStatusColor(selectedBooking.status),
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        {selectedBooking.status.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <strong>Created:</strong>
                                <p>{new Date(selectedBooking.createdAt).toLocaleDateString('th-TH')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
