'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div style={styles.container}>
            {/* Background Image with Overlay */}
            <div style={styles.backgroundImage}></div>
            <div style={styles.overlay}></div>

            {/* Content Card */}
            <div style={styles.content}>

                {/* Logo & Branding */}
                <div style={styles.logoSection}>
                    <div style={styles.logoWrapper}>
                        <img
                            src="/img/walking.png"
                            alt="Sri Saket Walking Street"
                            style={styles.logo}
                        />
                    </div>
                </div>

                <div style={styles.textSection}>
                    <h1 style={styles.title}>ตลาดถนนคนเดินศรีสะเกษ</h1>
                    <h2 style={styles.subtitle}>ระบบจองพื้นที่ขายของออนไลน์ สะดวก รวดเร็ว</h2>
                    <p style={styles.description}>
                        ยินดีต้อนรับพ่อค้าแม่ค้าทุกท่าน เข้าสู่ระบบการจองล็อกตลาดรูปแบบใหม่
                        เลือกทำเลที่ใช่ ในโซนที่คุณชอบ ได้ง่ายๆ เพียงปลายนิ้ว
                    </p>
                </div>

                {/* Call to Action Buttons */}
                <div style={styles.buttonGroup}>
                    <button
                        onClick={() => router.push('/login')}
                        style={styles.primaryButton}
                    >
                        🚀 เข้าสู่ระบบ / จองพื้นที่
                    </button>

                    <button
                        onClick={() => router.push('/register')}
                        style={styles.secondaryButton}
                    >
                        📝 สมัครสมาชิกใหม่
                    </button>
                </div>

                {/* Footer Info */}
                <div style={styles.footer}>
                    <p>© 2024 Sri Saket Walking Street. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

// ===========================================
// Styles (Inline for simplicity & zero-config)
// ===========================================

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: "'Sarabun', 'Inter', sans-serif",
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/img/walking.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px) brightness(0.7)',
        transform: 'scale(1.1)', // Prevent blur edges
        zIndex: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.6) 100%)',
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '60px 40px',
        borderRadius: '32px',
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '90%',
        animation: 'fadeInUp 0.8s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
    },
    logoSection: {
        marginBottom: '10px',
    },
    logoWrapper: {
        width: 'auto',
        maxWidth: '300px',
        margin: '0 auto',
    },
    logo: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        dropShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    textSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '480px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#2d3748',
        margin: 0,
        lineHeight: '1.2',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#4a5568',
        margin: 0,
    },
    description: {
        fontSize: '16px',
        color: '#718096',
        lineHeight: '1.6',
        margin: 0,
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '380px',
    },
    primaryButton: {
        backgroundColor: '#667eea',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '16px',
        padding: '18px 24px',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 20px rgba(118, 75, 162, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        color: '#764ba2',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '16px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    footer: {
        marginTop: '20px',
        borderTop: '1px solid #edf2f7',
        paddingTop: '20px',
        width: '100%',
    },
};
