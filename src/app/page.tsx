/**
 * Home Page - หน้าแรก
 * เข้าดูที่: http://localhost:3000
 */

'use client';

import { useRouter } from 'next/navigation';
'use client';

import { useState } from 'react';
import BookingForm from '@/components/BookingForm';
import BookingList from '@/components/BookingList';
import { useBookings } from '@/hooks/useBookings';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();

  export default function Home() {
    const { bookings, loading, error, addBooking, updateBookingStatus, removeBooking } = useBookings();
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const [adminError, setAdminError] = useState<string | null>(null);

    const handleBookingSubmit = async (booking: any) => {
      await addBooking(booking);
    };

    const handleStatusChange = async (id: string, status: any) => {
      try {
        await updateBookingStatus(id, status, adminToken || undefined);
      } catch (err) {
        setAdminError('Admin token required to update bookings. Please provide a valid token.');
      }
    };

    const handleDelete = async (id: string) => {
      try {
        await removeBooking(id, adminToken || undefined);
      } catch (err) {
        setAdminError('Admin token required to delete bookings. Please provide a valid token.');
      }
    };

    return (
      <div style={styles.container}>
        {/* Dark Overlay */}
        <div style={styles.overlay}></div>

        {/* Logo - ครอบด้วย div เพื่อซ่อนกรอบสีขาว */}
        <div style={styles.logoWrapper}>
          <img
            src="/img/walking-transparent.png?v=2"
            alt="ตลาดถนนคนเดินศรีสะเกษ"
            style={styles.logo}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={() => router.push('/login')}
          style={styles.loginButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
          }}
        >
          เข้าสู่ระบบ
        </button>
        <div className={styles.page}>
          <main className={styles.main}>
            <div className={styles.intro}>
              <h1>Walking Street Market - Booking System</h1>
              <p>Manage market stall bookings with our integrated API system</p>
            </div>

            {adminError && (
              <div style={{
                backgroundColor: '#ffebee',
                border: '1px solid #ef5350',
                color: '#c62828',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px'
              }}>
                {adminError}
              </div>
            )}

            <BookingForm onSubmit={handleBookingSubmit} loading={loading} />
            <BookingList
              bookings={bookings}
              loading={loading}
              error={error}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </main>
        </div>
        );
}

        const styles: {[key: string]: React.CSSProperties } = {
          container: {
          minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        backgroundImage: 'url(/img/market-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
        padding: '20px',
        position: 'relative',
  },
        overlay: {
          position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
  },
        logoWrapper: {
          width: '400px',
        maxWidth: '90vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'float 3s ease-in-out infinite',
        position: 'relative',
        zIndex: 2,
        background: 'rgba(255, 255, 255, 0.15)',
        padding: '20px',
        borderRadius: '20px',
        border: 'none',
        backdropFilter: 'blur(10px)',
  },
        logo: {
          width: '100%',
        height: 'auto',
        objectFit: 'contain',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4)) contrast(1.2) brightness(1.1)',
        mixBlendMode: 'multiply',
  },
        loginButton: {
          padding: '16px 48px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#667eea',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 2,
  },
};

        // เพิ่ม keyframe animation
        if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
        styleSheet.textContent = `
        @keyframes float {
          0 %, 100 % {
            transform: translateY(0px);
          }
            50% {
          transform: translateY(-20px);
            }
        }
        `;
        if (!document.querySelector('style[data-float-animation]')) {
          styleSheet.setAttribute('data-float-animation', 'true');
        document.head.appendChild(styleSheet);
  }
}
