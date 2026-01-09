/**
 * Forgot Password Page - หน้าลืมรหัสผ่าน
 * เข้าดูที่: http://localhost:3000/forgot-password
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = () => {
        if (!email) {
            setError('กรุณากรอกอีเมล');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('รูปแบบอีเมลไม่ถูกต้อง');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateEmail()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPassword(email);

            if (result.success) {
                setSuccess(true);
                setEmail('');
            } else {
                setError(result.error || 'ส่งลิงก์รีเซ็ตรหัสผ่านไม่สำเร็จ');
            }
        } catch {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.bgDecoration1}></div>
            <div style={styles.bgDecoration2}></div>

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logo}>🔑</div>
                    <h1 style={styles.title}>ลืมรหัสผ่าน?</h1>
                    <p style={styles.subtitle}>
                        กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้
                    </p>
                </div>

                {success ? (
                    <div style={styles.successBox}>
                        <div style={styles.successIcon}>✅</div>
                        <h3 style={styles.successTitle}>ส่งลิงก์สำเร็จ!</h3>
                        <p style={styles.successText}>
                            เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
                            กรุณาตรวจสอบอีเมลของคุณ
                        </p>
                        <a href="/login" style={styles.backButton}>
                            กลับไปหน้าเข้าสู่ระบบ
                        </a>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div style={styles.errorBox}>
                                <span style={styles.errorIcon}>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    <span style={styles.labelIcon}>📧</span>
                                    อีเมล
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="example@email.com"
                                    style={error ? { ...styles.input, ...styles.inputError } : styles.input}
                                    disabled={isLoading}
                                />
                                {error && (
                                    <span style={styles.errorText}>{error}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={isLoading ? { ...styles.submitButton, ...styles.submitButtonDisabled } : styles.submitButton}
                            >
                                {isLoading ? (
                                    <>
                                        <span style={styles.spinner}></span>
                                        กำลังส่งลิงก์...
                                    </>
                                ) : (
                                    <>
                                        <span>📨</span>
                                        ส่งลิงก์รีเซ็ตรหัสผ่าน
                                    </>
                                )}
                            </button>
                        </form>

                        <div style={styles.footer}>
                            <a href="/login" style={styles.backLink}>
                                ← กลับไปหน้าเข้าสู่ระบบ
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
    },
    bgDecoration1: {
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
    },
    bgDecoration2: {
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '48px',
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 1,
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logo: {
        fontSize: '64px',
        marginBottom: '16px',
        animation: 'bounce 2s infinite',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: '0 0 8px 0',
    },
    subtitle: {
        fontSize: '14px',
        color: '#7f8c8d',
        margin: 0,
        lineHeight: '1.6',
    },
    successBox: {
        textAlign: 'center',
        padding: '20px',
    },
    successIcon: {
        fontSize: '64px',
        marginBottom: '16px',
    },
    successTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#27ae60',
        margin: '0 0 12px 0',
    },
    successText: {
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '24px',
    },
    backButton: {
        display: 'inline-block',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        transition: 'all 0.3s',
    },
    errorBox: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
    },
    errorIcon: {
        fontSize: '18px',
    },
    form: {
        marginBottom: '24px',
    },
    formGroup: {
        marginBottom: '24px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#2c3e50',
    },
    labelIcon: {
        fontSize: '16px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        fontSize: '15px',
        transition: 'all 0.3s',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        backgroundColor: '#ffffff',
        color: '#2c3e50',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        display: 'block',
        marginTop: '6px',
        color: '#e74c3c',
        fontSize: '13px',
    },
    submitButton: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    submitButtonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid #fff',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #e0e0e0',
    },
    backLink: {
        color: '#4facfe',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
    },
};
