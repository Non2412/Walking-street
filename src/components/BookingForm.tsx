import { useState } from 'react';
import { Booking } from '@/services/api';
import styles from './BookingForm.module.css';

interface BookingFormProps {
  onSubmit: (booking: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loading?: boolean;
}

export default function BookingForm({ onSubmit, loading = false }: BookingFormProps) {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    email: '',
    shopType: 'food' as const,
    stallNumber: '',
    bookingDate: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.storeName.trim()) {
      setError('Store name is required');
      return;
    }
    if (!formData.ownerName.trim()) {
      setError('Owner name is required');
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    if (!formData.stallNumber.trim()) {
      setError('Stall number is required');
      return;
    }
    if (!formData.bookingDate) {
      setError('Booking date is required');
      return;
    }

    try {
      await onSubmit({
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        shopType: formData.shopType,
        stallNumber: formData.stallNumber,
        bookingDate: formData.bookingDate,
        notes: formData.notes || undefined,
      });

      setSuccess(true);
      setFormData({
        storeName: '',
        ownerName: '',
        phone: '',
        email: '',
        shopType: 'food',
        stallNumber: '',
        bookingDate: '',
        notes: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Create a New Booking</h2>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Booking created successfully!</div>}

      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label htmlFor="storeName">Store Name *</label>
          <input
            id="storeName"
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            placeholder="e.g., Coffee Shop"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ownerName">Owner Name *</label>
          <input
            id="ownerName"
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number (10 digits) *</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., 0812345678"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., john@example.com"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="shopType">Shop Type *</label>
          <select
            id="shopType"
            name="shopType"
            value={formData.shopType}
            onChange={handleChange}
            required
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
            id="stallNumber"
            type="text"
            name="stallNumber"
            value={formData.stallNumber}
            onChange={handleChange}
            placeholder="e.g., A01"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bookingDate">Booking Date *</label>
          <input
            id="bookingDate"
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes (optional)"
          rows={4}
        />
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'Creating...' : 'Create Booking'}
      </button>
    </form>
  );
}
