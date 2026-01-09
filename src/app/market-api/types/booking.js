/**
 * Type Definitions สำหรับ Booking
 */

/**
 * @typedef {'food' | 'clothing' | 'goods' | 'other'} ShopType
 */

/**
 * @typedef {'pending' | 'approved' | 'rejected'} BookingStatus
 */

/**
 * @typedef {Object} Booking
 * @property {string} _id - ID ของการจอง
 * @property {string} storeName - ชื่อร้าน
 * @property {string} ownerName - ชื่อเจ้าของ
 * @property {string} phone - เบอร์โทร (10 หลัก)
 * @property {string} email - อีเมล
 * @property {ShopType} shopType - ประเภทร้าน
 * @property {string} stallNumber - หมายเลขพื้นที่
 * @property {string} bookingDate - วันที่จอง
 * @property {BookingStatus} status - สถานะการจอง
 * @property {string} [notes] - หมายเหตุ (optional)
 * @property {string} createdAt - วันที่สร้าง
 * @property {string} updatedAt - วันที่อัพเดท
 */

/**
 * @typedef {Object} CreateBookingData
 * @property {string} storeName - ชื่อร้าน
 * @property {string} ownerName - ชื่อเจ้าของ
 * @property {string} phone - เบอร์โทร (10 หลัก)
 * @property {string} email - อีเมล
 * @property {ShopType} shopType - ประเภทร้าน
 * @property {string} stallNumber - หมายเลขพื้นที่
 * @property {string} bookingDate - วันที่จอง
 * @property {string} [notes] - หมายเหตุ (optional)
 */

// Constants
export const SHOP_TYPES = {
    FOOD: 'food',
    CLOTHING: 'clothing',
    GOODS: 'goods',
    OTHER: 'other',
};

export const SHOP_TYPE_LABELS = {
    food: 'อาหาร',
    clothing: 'เสื้อผ้า',
    goods: 'สินค้าทั่วไป',
    other: 'อื่นๆ',
};

export const BOOKING_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

export const BOOKING_STATUS_LABELS = {
    pending: 'รอดำเนินการ',
    approved: 'อนุมัติ',
    rejected: 'ปฏิเสธ',
};

export const BOOKING_STATUS_COLORS = {
    pending: '#FFA500',    // Orange
    approved: '#4CAF50',   // Green
    rejected: '#F44336',   // Red
};

// Validation helpers
export const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
};

export const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const validateBookingData = (data) => {
    const errors = {};

    if (!data.storeName?.trim()) {
        errors.storeName = 'กรุณากรอกชื่อร้าน';
    }

    if (!data.ownerName?.trim()) {
        errors.ownerName = 'กรุณากรอกชื่อเจ้าของ';
    }

    if (!data.phone) {
        errors.phone = 'กรุณากรอกเบอร์โทร';
    } else if (!validatePhone(data.phone)) {
        errors.phone = 'เบอร์โทรต้องเป็นตัวเลข 10 หลัก';
    }

    if (!data.email) {
        errors.email = 'กรุณากรอกอีเมล';
    } else if (!validateEmail(data.email)) {
        errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (!data.shopType) {
        errors.shopType = 'กรุณาเลือกประเภทร้าน';
    } else if (!Object.values(SHOP_TYPES).includes(data.shopType)) {
        errors.shopType = 'ประเภทร้านไม่ถูกต้อง';
    }

    if (!data.stallNumber?.trim()) {
        errors.stallNumber = 'กรุณากรอกหมายเลขพื้นที่';
    }

    if (!data.bookingDate) {
        errors.bookingDate = 'กรุณาเลือกวันที่จอง';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Format helpers
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
