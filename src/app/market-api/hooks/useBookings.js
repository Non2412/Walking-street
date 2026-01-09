/**
 * Custom React Hook สำหรับจัดการ Bookings
 * ใช้งาน: const { bookings, loading, error, ... } = useBookings();
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';

export function useBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ดึงข้อมูลทั้งหมด
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookingService.getAll();
            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // โหลดข้อมูลครั้งแรก
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // สร้างการจองใหม่
    const createBooking = useCallback(async (bookingData) => {
        try {
            setError(null);
            const newBooking = await bookingService.create(bookingData);
            setBookings(prev => [newBooking, ...prev]);
            return newBooking;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // อัพเดทสถานะ
    const updateBookingStatus = useCallback(async (id, status) => {
        try {
            setError(null);
            const updated = await bookingService.updateStatus(id, status);
            setBookings(prev =>
                prev.map(booking =>
                    booking._id === id ? updated : booking
                )
            );
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // ลบการจอง
    const deleteBooking = useCallback(async (id) => {
        try {
            setError(null);
            await bookingService.delete(id);
            setBookings(prev => prev.filter(booking => booking._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Refresh ข้อมูล
    const refresh = useCallback(() => {
        fetchBookings();
    }, [fetchBookings]);

    return {
        bookings,
        loading,
        error,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        refresh,
    };
}

/**
 * Hook สำหรับดึงข้อมูลการจองเดียว
 */
export function useBooking(id) {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchBooking = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await bookingService.getById(id);
                setBooking(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    return { booking, loading, error };
}

/**
 * Hook สำหรับฟิลเตอร์ตามสถานะ
 */
export function useBookingsByStatus(status) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await bookingService.getByStatus(status);
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [status]);

    return { bookings, loading, error };
}

/**
 * Hook สำหรับฟิลเตอร์ตามประเภทร้าน
 */
export function useBookingsByShopType(shopType) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await bookingService.getByShopType(shopType);
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [shopType]);

    return { bookings, loading, error };
}
