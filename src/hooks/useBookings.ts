import { useState, useEffect, useCallback } from 'react';
import { Booking, getBookings, createBooking, updateBooking, deleteBooking } from '@/services/api';

export interface UseBookingsResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addBooking: (booking: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking['status'], token?: string) => Promise<Booking>;
  removeBooking: (id: string, token?: string) => Promise<void>;
}

export const useBookings = (): UseBookingsResult => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBooking = useCallback(
    async (booking: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newBooking = await createBooking(booking);
        setBookings((prev) => [newBooking, ...prev]);
        return newBooking;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create booking';
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateBookingStatus = useCallback(
    async (id: string, status: Booking['status'], token?: string) => {
      try {
        const updated = await updateBooking(id, { status }, token);
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? updated : b))
        );
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update booking';
        setError(message);
        throw err;
      }
    },
    []
  );

  const removeBooking = useCallback(
    async (id: string, token?: string) => {
      try {
        await deleteBooking(id, token);
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete booking';
        setError(message);
        throw err;
      }
    },
    []
  );

  // Fetch bookings on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    bookings,
    loading,
    error,
    refetch,
    addBooking,
    updateBookingStatus,
    removeBooking,
  };
};
