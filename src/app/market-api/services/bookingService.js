/**
 * Market Booking API Service
 * ฟังก์ชันสำหรับเรียกใช้ API ของระบบจองพื้นที่ตลาด
 */

const API_BASE_URL = 'https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings';

/**
 * ดึงข้อมูลการจองทั้งหมด
 * @returns {Promise<Array>} รายการการจองทั้งหมด
 */
export async function getAllBookings() {
    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch bookings');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
}

/**
 * ดึงข้อมูลการจองตาม ID
 * @param {string} id - ID ของการจอง
 * @returns {Promise<Object>} ข้อมูลการจอง
 */
export async function getBookingById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch booking');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
}

/**
 * สร้างการจองใหม่
 * @param {Object} bookingData - ข้อมูลการจอง
 * @param {string} bookingData.storeName - ชื่อร้าน
 * @param {string} bookingData.ownerName - ชื่อเจ้าของ
 * @param {string} bookingData.phone - เบอร์โทร (10 หลัก)
 * @param {string} bookingData.email - อีเมล
 * @param {string} bookingData.shopType - ประเภทร้าน (food, clothing, goods, other)
 * @param {string} bookingData.stallNumber - หมายเลขพื้นที่
 * @param {string} bookingData.bookingDate - วันที่จอง
 * @param {string} [bookingData.notes] - หมายเหตุ (optional)
 * @returns {Promise<Object>} ข้อมูลการจองที่สร้างแล้ว
 */
export async function createBooking(bookingData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to create booking');
        }

        return data.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

/**
 * อัพเดทสถานะการจอง
 * @param {string} id - ID ของการจอง
 * @param {string} status - สถานะใหม่ (pending, approved, rejected)
 * @returns {Promise<Object>} ข้อมูลการจองที่อัพเดทแล้ว
 */
export async function updateBookingStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to update booking');
        }

        return data.data;
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
}

/**
 * ลบการจอง
 * @param {string} id - ID ของการจอง
 * @returns {Promise<Object>} ผลลัพธ์การลบ
 */
export async function deleteBooking(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to delete booking');
        }

        return data.data;
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
}

/**
 * ฟิลเตอร์การจองตามสถานะ
 * @param {string} status - สถานะที่ต้องการ (pending, approved, rejected)
 * @returns {Promise<Array>} รายการการจองที่ตรงตามสถานะ
 */
export async function getBookingsByStatus(status) {
    try {
        const bookings = await getAllBookings();
        return bookings.filter(booking => booking.status === status);
    } catch (error) {
        console.error('Error filtering bookings:', error);
        throw error;
    }
}

/**
 * ฟิลเตอร์การจองตามประเภทร้าน
 * @param {string} shopType - ประเภทร้าน (food, clothing, goods, other)
 * @returns {Promise<Array>} รายการการจองที่ตรงตามประเภท
 */
export async function getBookingsByShopType(shopType) {
    try {
        const bookings = await getAllBookings();
        return bookings.filter(booking => booking.shopType === shopType);
    } catch (error) {
        console.error('Error filtering bookings:', error);
        throw error;
    }
}

// Export ทั้งหมดเป็น object เดียว
export const bookingService = {
    getAll: getAllBookings,
    getById: getBookingById,
    create: createBooking,
    updateStatus: updateBookingStatus,
    delete: deleteBooking,
    getByStatus: getBookingsByStatus,
    getByShopType: getBookingsByShopType,
};

export default bookingService;
