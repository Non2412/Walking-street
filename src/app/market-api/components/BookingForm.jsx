/**
 * BookingForm Component
 * ฟอร์มสำหรับสร้างการจองใหม่
 */

'use client';

import { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import {
    SHOP_TYPES,
    SHOP_TYPE_LABELS,
    validateBookingData
} from '../types/booking';

export default function BookingForm({ onSuccess }) {
    const { createBooking } = useBookings();
    const [formData, setFormData] = useState({
        storeName: '',
        ownerName: '',
        phone: '',
        email: '',
        shopType: '',
        stallNumber: '',
        bookingDate: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // ลบ error ของ field ที่กำลังแก้ไข
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const validation = validateBookingData(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setSubmitting(true);
        try {
            const newBooking = await createBooking(formData);
            alert('สร้างการจองสำเร็จ!');

            // Reset form
            setFormData({
                storeName: '',
                ownerName: '',
                phone: '',
                email: '',
                shopType: '',
                stallNumber: '',
                bookingDate: '',
                notes: '',
            });
            setErrors({});

            if (onSuccess) {
                onSuccess(newBooking);
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาด: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📝 สร้างการจองใหม่</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Store Name */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        ชื่อร้าน <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        style={errors.storeName ? { ...styles.input, ...styles.inputError } : styles.input}
                        placeholder="เช่น ร้านกาแฟอร่อย"
                    />
                    {errors.storeName && <span style={styles.errorText}>{errors.storeName}</span>}
                </div>

                {/* Owner Name */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        ชื่อเจ้าของ <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        style={errors.ownerName ? { ...styles.input, ...styles.inputError } : styles.input}
                        placeholder="เช่น นายสมชาย ใจดี"
                    />
                    {errors.ownerName && <span style={styles.errorText}>{errors.ownerName}</span>}
                </div>

                {/* Phone */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        เบอร์โทร <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={errors.phone ? { ...styles.input, ...styles.inputError } : styles.input}
                        placeholder="0812345678"
                        maxLength="10"
                    />
                    {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
                </div>

                {/* Email */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        อีเมล <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                        placeholder="example@email.com"
                    />
                    {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                </div>

                {/* Shop Type */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        ประเภทร้าน <span style={styles.required}>*</span>
                    </label>
                    <select
                        name="shopType"
                        value={formData.shopType}
                        onChange={handleChange}
                        style={errors.shopType ? { ...styles.select, ...styles.inputError } : styles.select}
                    >
                        <option value="">-- เลือกประเภทร้าน --</option>
                        {Object.entries(SHOP_TYPES).map(([key, value]) => (
                            <option key={value} value={value}>
                                {SHOP_TYPE_LABELS[value]}
                            </option>
                        ))}
                    </select>
                    {errors.shopType && <span style={styles.errorText}>{errors.shopType}</span>}
                </div>

                {/* Stall Number */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        หมายเลขพื้นที่ <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="stallNumber"
                        value={formData.stallNumber}
                        onChange={handleChange}
                        style={errors.stallNumber ? { ...styles.input, ...styles.inputError } : styles.input}
                        placeholder="เช่น A01, B15"
                    />
                    {errors.stallNumber && <span style={styles.errorText}>{errors.stallNumber}</span>}
                </div>

                {/* Booking Date */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        วันที่จอง <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="date"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        style={errors.bookingDate ? { ...styles.input, ...styles.inputError } : styles.input}
                    />
                    {errors.bookingDate && <span style={styles.errorText}>{errors.bookingDate}</span>}
                </div>

                {/* Notes */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>หมายเหตุ</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="ข้อมูลเพิ่มเติม (ถ้ามี)"
                        rows="3"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting}
                    style={submitting ? { ...styles.submitButton, ...styles.submitButtonDisabled } : styles.submitButton}
                >
                    {submitting ? '⏳ กำลังส่งข้อมูล...' : '✓ สร้างการจอง'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#333',
    },
    form: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '14px',
    },
    required: {
        color: '#F44336',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.2s',
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.2s',
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    inputError: {
        borderColor: '#F44336',
    },
    errorText: {
        display: 'block',
        marginTop: '4px',
        color: '#F44336',
        fontSize: '12px',
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
};
