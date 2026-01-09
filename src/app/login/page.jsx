'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // ลบ error เมื่อผู้ใช้เริ่มพิมพ์
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'กรุณากรอกอีเมล';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        }

        if (!formData.password) {
            newErrors.password = 'กรุณากรอกรหัสผ่าน';
        } else if (formData.password.length < 6) {
            newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                router.push('/');
            } else {
                setErrors({
                    general: result.error || 'เข้าสู่ระบบไม่สำเร็จ',
                });
            }
        } catch {
            setErrors({
                general: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Background Decoration */}
            <div style={styles.bgDecoration1}></div>
            <div style={styles.bgDecoration2}></div>

            {/* Login Card */}
            <div style={styles.card}>
                {/* Logo/Header */}
                <div style={styles.header}>
                    <div style={styles.logo}>🏪</div>
                    <h1 style={styles.title}>ระบบจัดการตลาด</h1>
                    <p style={styles.subtitle}>เข้าสู่ระบบเพื่อจัดการการจองพื้นที่</p>
                </div>

                {/* Error Message */}
                {errors.general && (
                    <div style={styles.errorBox}>
                        <span style={styles.errorIcon}>⚠️</span>
                        <span>{errors.general}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Email Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>📧</span>
                            อีเมล
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <span style={styles.errorText}>{errors.email}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>🔒</span>
                            รหัสผ่าน
                        </label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={errors.password ? { ...styles.input, ...styles.inputError } : styles.input}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.togglePassword}
                                disabled={isLoading}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && (
                            <span style={styles.errorText}>{errors.password}</span>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div style={styles.options}>
                        <label style={styles.checkbox}>
                            <input type="checkbox" style={styles.checkboxInput} />
                            <span style={styles.checkboxLabel}>จดจำฉันไว้</span>
                        </label>
                        <a href="/forgot-password" style={styles.forgotPassword}>
                            ลืมรหัสผ่าน?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={isLoading ? { ...styles.submitButton, ...styles.submitButtonDisabled } : styles.submitButton}
                    >
                        {isLoading ? (
                            <>
                                <span style={styles.spinner}></span>
                                กำลังเข้าสู่ระบบ...
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                เข้าสู่ระบบ
                            </>
                        )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        ยังไม่มีบัญชี?{' '}
                        <a href="/register" style={styles.signUpLink}>
                            สมัครสมาชิก
                        </a>
                    </p>
                </div>

                {/* Demo Credentials */}
                <div style={styles.demoBox}>
                    <p style={styles.demoTitle}>🔑 ข้อมูลทดสอบ:</p>
                    <p style={styles.demoText}>Email: admin@example.com</p>
                    <p style={styles.demoText}>Password: 123456</p>
                </div>
            </div>
        </div>
    );
}

// ========================================
// Styles
// ========================================

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        marginBottom: '20px',
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
    passwordWrapper: {
        position: 'relative',
    },
    togglePassword: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        padding: '4px',
    },
    errorText: {
        display: 'block',
        marginTop: '6px',
        color: '#e74c3c',
        fontSize: '13px',
    },
    options: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    checkboxInput: {
        cursor: 'pointer',
    },
    checkboxLabel: {
        fontSize: '14px',
        color: '#555',
    },
    forgotPassword: {
        fontSize: '14px',
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
    },
    submitButton: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    footerText: {
        margin: 0,
        fontSize: '14px',
        color: '#666',
    },
    signUpLink: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
    },
    demoBox: {
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '2px dashed #dee2e6',
    },
    demoTitle: {
        margin: '0 0 8px 0',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#495057',
    },
    demoText: {
        margin: '4px 0',
        fontSize: '12px',
        color: '#6c757d',
        fontFamily: 'monospace',
    },
};
