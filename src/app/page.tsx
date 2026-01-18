/**
 * Home Page - หน้าแรก
 * เข้าดูที่: http://localhost:3000
 */

'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

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
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
            0%, 100% {
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
