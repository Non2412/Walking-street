'use client';

import { useState } from 'react';
import { MarketAuthProvider, useMarketAuth } from '@/contexts/MarketAuthContext';

function LoginForm() {
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
            backgroundColor: '#f5f5f5',
        },
        card: {
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '8px',
            color: '#333',
        },
        subtitle: {
            fontSize: '14px',
            textAlign: 'center',
            color: '#666',
            marginBottom: '24px',
        },
        tabs: {
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            backgroundColor: '#f0f0f0',
            padding: '4px',
            borderRadius: '8px',
        },
        tab: {
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#666',
            transition: 'all 0.3s',
        },
        tabActive: {
            backgroundColor: '#fff',
            color: '#333',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
        input: {
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
        },
        inputError: {
            borderColor: '#e74c3c',
        },
        error: {
            color: '#e74c3c',
            fontSize: '12px',
            marginTop: '4px',
        },
        generalError: {
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
        },
        button: {
            padding: '12px',
            backgroundColor: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
        },
        buttonDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>เข้าสู่ระบบ</h1>
                <p style={styles.subtitle}>ระบบจัดการตลาดถนนคนเดิน</p>

                <div style={styles.tabs}>
                    <button
                        style={{ ...styles.tab, ...(role === 'user' ? styles.tabActive : {}) }}
                        onClick={() => setRole('user')}
                    >
                        ลูกค้า
                    </button>
                    <button
                        style={{ ...styles.tab, ...(role === 'admin' ? styles.tabActive : {}) }}
                        onClick={() => setRole('admin')}
                    >
                        ผู้ดูแล
                    </button>
                </div>

                {errors.general && <div style={styles.generalError}>{errors.general}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder={role === 'admin' ? 'admin@example.com' : 'user@example.com'}
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.email ? styles.inputError : {}),
                            }}
                        />
                        {errors.email && <div style={styles.error}>{errors.email}</div>}
                    </div>

                    <div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="รหัสผ่าน"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.password ? styles.inputError : {}),
                            }}
                        />
                        {errors.password && <div style={styles.error}>{errors.password}</div>}
                    </div>

                    <label style={{ display: 'flex', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                        />
                        แสดงรหัสผ่าน
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...styles.button,
                            ...(isLoading ? styles.buttonDisabled : {}),
                        }}
                    >
                        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <MarketAuthProvider>
            <LoginForm />
        </MarketAuthProvider>
    );
}
