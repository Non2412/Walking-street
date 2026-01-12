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
    
    // Use mock data directly (API has CORS issues)
    const mockData: any[] = [
        {
          _id: '1',
          storeName: 'ร้านกาแฟเก่า',
          ownerName: 'สมชาย ใจดี',
          phone: '0812345678',
          email: 'somchai@example.com',
          shopType: 'food',
          stallNumber: 'A01',
          bookingDate: '2025-01-15',
          status: 'pending',
          createdAt: '2025-01-09T10:30:00Z',
        },
        {
          _id: '2',
          storeName: 'ร้านเสื้อผ้า Modern',
          ownerName: 'ส่วย สวยใจ',
          phone: '0898765432',
          email: 'suay@example.com',
          shopType: 'clothing',
          stallNumber: 'B02',
          bookingDate: '2025-01-16',
          status: 'approved',
          createdAt: '2025-01-08T14:20:00Z',
        },
        {
          _id: '3',
          storeName: 'ร้านขนมหวาน Golden',
          ownerName: 'ดำ รสหวาน',
          phone: '0867543210',
          email: 'dam@example.com',
          shopType: 'food',
          stallNumber: 'C03',
          bookingDate: '2025-01-17',
          status: 'rejected',
          createdAt: '2025-01-07T11:45:00Z',
        },
        {
          _id: '4',
          storeName: 'ร้านเครื่องใช้บ้าน',
          ownerName: 'เขียว สดใจ',
          phone: '0912345678',
          email: 'khiao@example.com',
          shopType: 'goods',
          stallNumber: 'D04',
          bookingDate: '2025-01-18',
          status: 'pending',
          createdAt: '2025-01-06T16:30:00Z',
        }
    ];
    
    setBookings(mockData);
    setLoading(false);
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
