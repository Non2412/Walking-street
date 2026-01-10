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
      {/* Logo - ครอบด้วย div เพื่อซ่อนกรอบสีขาว */}
      <div style={styles.logoWrapper}>
        <img
          src="/img/walking.png"
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
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '48px',
    padding: '20px',
  },
  logoWrapper: {
    width: '400px',
    maxWidth: '90vw',
    height: '280px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'float 3s ease-in-out infinite',
  },
  logo: {
    width: '500px',
    height: 'auto',
    objectFit: 'contain',
    marginTop: '-60px',
    marginBottom: '-60px',
    marginLeft: '-50px',
    marginRight: '-50px',
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
