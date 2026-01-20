'use client';

import { useState, useEffect } from 'react';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import styles from './booking-detail.module.css';

export default function BookingDetail({ bookingId, onClose, onUpdate }) {
    const { token } = useMarketAuth();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app';

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
            });

            const data = await response.json();

            if (data.success) {
                setBooking(data.data);
                setFormData(data.data);
            } else {
                setError('Failed to load booking');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Update failed');
            }

            setBooking(data.data);
            alert('✅ Status updated successfully');
            if (onUpdate) onUpdate(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;

        setUpdating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Delete failed');
            }

            alert('✅ Booking deleted successfully');
            if (onClose) onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!booking) {
        return <div className={styles.error}>Booking not found</div>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f39c12';
            case 'approved': return '#27ae60';
            case 'rejected': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{booking.storeName}</h2>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.statusSection}>
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

            <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                    <label>Owner Name</label>
                    <p>{booking.ownerName}</p>
                </div>

                <div className={styles.detailItem}>
                    <label>Phone</label>
                    <p>{booking.phone}</p>
                </div>

                <div className={styles.detailItem}>
                    <label>Email</label>
                    <p>{booking.email}</p>
                </div>

                <div className={styles.detailItem}>
                    <label>Shop Type</label>
                    <p>{booking.shopType}</p>
                </div>

                <div className={styles.detailItem}>
                    <label>Stall Number</label>
                    <p>{booking.stallNumber}</p>
                </div>

                <div className={styles.detailItem}>
                    <label>Booking Date</label>
                    <p>{new Date(booking.bookingDate).toLocaleDateString('th-TH')}</p>
                </div>

                <div className={styles.detailItem}>
                    <label>Created</label>
                    <p>{new Date(booking.createdAt).toLocaleDateString('th-TH')}</p>
                </div>

                <div className={styles.detailItem}>
                    <label>Updated</label>
                    <p>{new Date(booking.updatedAt).toLocaleDateString('th-TH')}</p>
                </div>
            </div>

            {/* Admin Actions */}
            {token && (
                <div className={styles.actions}>
                    {booking.status !== 'approved' && (
                        <button
                            className={styles.approveBtn}
                            onClick={() => handleUpdateStatus('approved')}
                            disabled={updating}
                        >
                            ✅ Approve
                        </button>
                    )}

                    {booking.status !== 'rejected' && (
                        <button
                            className={styles.rejectBtn}
                            onClick={() => handleUpdateStatus('rejected')}
                            disabled={updating}
                        >
                            ❌ Reject
                        </button>
                    )}

                    <button
                        className={styles.deleteBtn}
                        onClick={handleDelete}
                        disabled={updating}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
}
