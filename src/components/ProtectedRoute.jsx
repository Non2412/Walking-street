/**
 * Protected Route Component
 * ป้องกันหน้าที่ต้องเข้าสู่ระบบก่อน
 * 
 * วิธีใช้:
 * import ProtectedRoute from '@/components/ProtectedRoute';
 * 
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, redirectTo = '/login' }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push(redirectTo);
        }
    }, [user, loading, router, redirectTo]);

    // แสดง loading ขณะตรวจสอบ
    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>กำลังตรวจสอบสิทธิ์...</p>
            </div>
        );
    }

    // ถ้าไม่มี user ให้แสดงหน้าว่าง (จะ redirect อยู่แล้ว)
    if (!user) {
        return null;
    }

    // ถ้ามี user แล้วให้แสดง children
    return <>{children}</>;
}

const styles = {
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px',
    },
    loadingText: {
        color: '#666',
        fontSize: '16px',
    },
};
