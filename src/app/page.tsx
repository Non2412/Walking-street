'use client';

import { useState } from 'react';
import BookingForm from '@/components/BookingForm';
import BookingList from '@/components/BookingList';
import { useBookings } from '@/hooks/useBookings';
import styles from './page.module.css';

export default function Home() {
  const { bookings, loading, error, addBooking, updateBookingStatus, removeBooking } = useBookings();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleBookingSubmit = async (booking: any) => {
    await addBooking(booking);
  };

  const handleStatusChange = async (id: string, status: any) => {
    try {
      await updateBookingStatus(id, status, adminToken || undefined);
    } catch (err) {
      setAdminError('Admin token required to update bookings. Please provide a valid token.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeBooking(id, adminToken || undefined);
    } catch (err) {
      setAdminError('Admin token required to delete bookings. Please provide a valid token.');
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Walking Street Market - Booking System</h1>
          <p>Manage market stall bookings with our integrated API system</p>
        </div>

        {adminError && (
          <div style={{
            backgroundColor: '#ffebee',
            border: '1px solid #ef5350',
            color: '#c62828',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {adminError}
          </div>
        )}

        <BookingForm onSubmit={handleBookingSubmit} loading={loading} />
        <BookingList
          bookings={bookings}
          loading={loading}
          error={error}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
