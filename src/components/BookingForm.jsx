'use client';

import { useState } from 'react';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import styles from './booking-form.module.css';

export default function BookingForm({ onSuccess }) {
    const { token } = useMarketAuth();
    const [formData, setFormData] = useState({
        storeName: '',
        ownerName: '',
        phone: '',
        email: '',
        shopType: 'food',
        stallNumber: '',
        bookingDate: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.storeName) newErrors.storeName = 'Store name is required';
        if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
        
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.stallNumber) newErrors.stallNumber = 'Stall number is required';
        if (!formData.bookingDate) newErrors.bookingDate = 'Booking date is required';
        else if (new Date(formData.bookingDate) < new Date()) newErrors.bookingDate = 'Date cannot be in the past';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    ...formData,
                    bookingDate: new Date(formData.bookingDate).toISOString(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Booking failed');
            }

            alert('✅ Booking created successfully!');
            setFormData({
                storeName: '',
                ownerName: '',
                phone: '',
                email: '',
                shopType: 'food',
                stallNumber: '',
                bookingDate: '',
            });

            if (onSuccess) onSuccess(data.data);
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Create Booking</h2>

            {errors.submit && <div className={styles.error}>{errors.submit}</div>}

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="storeName">Store Name *</label>
                    <input
                        type="text"
                        id="storeName"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        placeholder="ร้านกาแฟ"
                        className={errors.storeName ? styles.inputError : ''}
                    />
                    {errors.storeName && <span className={styles.fieldError}>{errors.storeName}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="ownerName">Owner Name *</label>
                    <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="สมชาย"
                        className={errors.ownerName ? styles.inputError : ''}
                    />
                    {errors.ownerName && <span className={styles.fieldError}>{errors.ownerName}</span>}
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone (10 digits) *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0812345678"
                        maxLength="10"
                        className={errors.phone ? styles.inputError : ''}
                    />
                    {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="somchai@example.com"
                        className={errors.email ? styles.inputError : ''}
                    />
                    {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="shopType">Shop Type *</label>
                    <select
                        id="shopType"
                        name="shopType"
                        value={formData.shopType}
                        onChange={handleChange}
                    >
                        <option value="food">Food</option>
                        <option value="clothing">Clothing</option>
                        <option value="goods">Goods</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="stallNumber">Stall Number *</label>
                    <input
                        type="text"
                        id="stallNumber"
                        name="stallNumber"
                        value={formData.stallNumber}
                        onChange={handleChange}
                        placeholder="A01"
                        className={errors.stallNumber ? styles.inputError : ''}
                    />
                    {errors.stallNumber && <span className={styles.fieldError}>{errors.stallNumber}</span>}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="bookingDate">Booking Date *</label>
                <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    className={errors.bookingDate ? styles.inputError : ''}
                />
                {errors.bookingDate && <span className={styles.fieldError}>{errors.bookingDate}</span>}
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? 'Creating Booking...' : 'Create Booking'}
            </button>
        </form>
    );
}
