'use client';

import { useState } from 'react';
import { MarketAuthProvider, useMarketAuth } from '@/contexts/MarketAuthContext';

function LoginFormContent() {
    const { login, adminLogin } = useMarketAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'กรุณากรอกอีเมล';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        if (!formData.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
        else if (formData.password.length < 6) newErrors.password = 'รหัสผ่านต้องมี 6 ตัวขึ้นไป';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            console.log('🔐 Login attempt:', { email: formData.email, role });
            
            const loginFunc = role === 'admin' ? adminLogin : login;
            const result = await loginFunc(formData.email, formData.password);
            
            console.log('✅ Login result:', result);

            if (result.success) {
                window.location.href = role === 'admin' ? '/admin-dashboard' : '/bookings';
            } else {
                setErrors({ general: result.error || 'เข้าสู่ระบบไม่สำเร็จ' });
            }
        } catch (error) {
            console.error('❌ Error:', error);
            setErrors({ general: 'เกิดข้อผิดพลาด' });
        } finally {
            setIsLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
        },
        backgroundImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/img/walking.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.1)',
            zIndex: 0,
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
        card: {
            backgroundColor: '#fff',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            padding: '48px',
            width: '100%',
            maxWidth: '480px',
            position: 'relative',
            zIndex: 2,
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px',
        },
        logoImage: {
            width: '280px',
            height: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
            marginBottom: '24px',
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
        tabsContainer: {
            display: 'flex',
            backgroundColor: '#f1f2f6',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
        },
        tab: {
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: '#7f8c8d',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
        },
        activeTab: {
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#2c3e50',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundImage}></div>
            <div style={styles.overlay}></div>

            <div style={styles.card}>
                <div style={styles.header}>
                    <img src="/img/walking.png" alt="Logo" style={styles.logoImage} />
                    <h1 style={styles.title}>ระบบจัดการตลาด</h1>
                    <p style={styles.subtitle}>เข้าสู่ระบบเพื่อจัดการการจองพื้นที่</p>
                </div>

                {/* Role Tabs */}
                <div style={styles.tabsContainer}>
                    <button
                        type="button"
                        style={role === 'user' ? styles.activeTab : styles.tab}
                        onClick={() => setRole('user')}
                    >
                        ลูกค้า / ผู้จอง
                    </button>
                    <button
                        type="button"
                        style={role === 'admin' ? styles.activeTab : styles.tab}
                        onClick={() => setRole('admin')}
                    >
                        ผู้ดูแลระบบ
                    </button>
                </div>

                {errors.general && (
                    <div style={styles.errorBox}>
                        <span style={styles.errorIcon}>⚠️</span>
                        <span>{errors.general}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>📧</span>
                            อีเมล ({role === 'admin' ? 'Admin' : 'User'})
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={role === 'admin' ? "admin@example.com" : "example@email.com"}
                            style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                            disabled={isLoading}
                        />
                        {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                    </div>

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
                        {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div style={styles.options}>
                        <label style={styles.checkbox}>
                            <input type="checkbox" style={styles.checkboxInput} />
                            <span style={styles.checkboxLabel}>จดจำฉันไว้</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={isLoading ? { ...styles.submitButton, ...styles.submitButtonDisabled } : styles.submitButton}
                    >
                        {isLoading ? (
                            <><span style={styles.spinner}></span>กำลังเข้าสู่ระบบ...</>
                        ) : (
                            <><span style={{ marginRight: '8px' }}>🚀</span>เข้าสู่ระบบ ({role === 'admin' ? 'Admin' : 'User'})</>
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        ยังไม่มีบัญชี?{' '}
                        <a href="/register" style={styles.signUpLink}>สมัครสมาชิก</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <MarketAuthProvider>
            <LoginFormContent />
        </MarketAuthProvider>
    );
}
