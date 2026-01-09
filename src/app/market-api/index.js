/**
 * Market API Client - Main Export File
 * Import ทุกอย่างที่ต้องการจากไฟล์นี้
 * 
 * @example
 * import { bookingService, useBookings, BookingList } from '@/market-api';
 */

// Services
export { default as bookingService } from './services/bookingService';
export {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    getBookingsByStatus,
    getBookingsByShopType,
} from './services/bookingService';

// Hooks
export {
    useBookings,
    useBooking,
    useBookingsByStatus,
    useBookingsByShopType,
} from './hooks/useBookings';

// Components
export { default as BookingList } from './components/BookingList';
export { default as BookingForm } from './components/BookingForm';

// Types & Constants
export {
    SHOP_TYPES,
    SHOP_TYPE_LABELS,
    BOOKING_STATUS,
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_COLORS,
    validatePhone,
    validateEmail,
    validateBookingData,
    formatDate,
    formatDateTime,
} from './types/booking';
