import { Booking } from '@/services/api';
import styles from './BookingList.module.css';

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  onStatusChange?: (id: string, status: Booking['status']) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function BookingList({
  bookings,
  loading,
  error,
  onStatusChange,
  onDelete,
}: BookingListProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading bookings...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>Error: {error}</p></div>;
  }

  if (bookings.length === 0) {
    return <div className={styles.container}><p>No bookings found.</p></div>;
  }

  return (
    <div className={styles.container}>
      <h2>Bookings ({bookings.length})</h2>
      <div className={styles.grid}>
        {bookings.map((booking) => (
          <div key={booking._id} className={styles.card}>
            <div className={styles.header}>
              <h3>{booking.storeName}</h3>
              <span
                className={styles.status}
                style={{ backgroundColor: getStatusColor(booking.status) }}
              >
                {booking.status || 'pending'}
              </span>
            </div>

            <div className={styles.info}>
              <p><strong>Owner:</strong> {booking.ownerName}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Type:</strong> {booking.shopType}</p>
              <p><strong>Stall:</strong> {booking.stallNumber}</p>
              <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
            </div>

            {(onStatusChange || onDelete) && (
              <div className={styles.actions}>
                {onStatusChange && (
                  <>
                    {booking.status !== 'approved' && (
                      <button
                        className={styles.btnApprove}
                        onClick={() => onStatusChange(booking._id!, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {booking.status !== 'rejected' && (
                      <button
                        className={styles.btnReject}
                        onClick={() => onStatusChange(booking._id!, 'rejected')}
                      >
                        Reject
                      </button>
                    )}
                  </>
                )}
                {onDelete && (
                  <button
                    className={styles.btnDelete}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this booking?')) {
                        onDelete(booking._id!);
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}

            <div className={styles.footer}>
              <small>Created: {new Date(booking.createdAt || '').toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
