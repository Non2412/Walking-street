/**
 * Register Page - หน้าสมัครสมาชิก
 * เข้าดูที่: http://localhost:3000/register
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        shopName: '',
        shopDescription: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'กรุณากรอกชื่อ';
        }

        if (!formData.shopName.trim()) {
            newErrors.shopName = 'กรุณากรอกชื่อร้าน';
        }

        if (!formData.shopDescription.trim()) {
            newErrors.shopDescription = 'กรุณากรอกรายละเอียดร้าน';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/-/g, ''))) {
            newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง (10 หลัก)';
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
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
            const result = await register(formData);

            if (result.success) {
                router.push('/');
            } else {
                setErrors({
                    general: result.error || 'สมัครสมาชิกไม่สำเร็จ',
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
            {/* Background Image */}
            <div style={styles.backgroundImage}></div>
            <div style={styles.overlay}></div>

            <div style={styles.card}>
                <div style={styles.header}>
                    <img
                        src="/img/walking.png"
                        alt="Logo"
                        style={styles.logoImage}
                    />
                    <h1 style={styles.title}>สมัครสมาชิก</h1>
                    <p style={styles.subtitle}>สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบ</p>
                </div>

                {errors.general && (
                    <div style={styles.errorBox}>
                        <span style={styles.errorIcon}>⚠️</span>
                        <span>{errors.general}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Row 1: Name and Shop Name */}
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>👤</span>
                                ชื่อ-นามสกุล
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="นายสมชาย ใจดี"
                                style={errors.name ? { ...styles.input, ...styles.inputError } : styles.input}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <span style={styles.errorText}>{errors.name}</span>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>🏪</span>
                                ชื่อร้าน
                            </label>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                                placeholder="ร้านขายของชำ"
                                style={errors.shopName ? { ...styles.input, ...styles.inputError } : styles.input}
                                disabled={isLoading}
                            />
                            {errors.shopName && (
                                <span style={styles.errorText}>{errors.shopName}</span>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Shop Description and Phone */}
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>📝</span>
                                รายละเอียดร้าน
                            </label>
                            <input
                                type="text"
                                name="shopDescription"
                                value={formData.shopDescription}
                                onChange={handleChange}
                                placeholder="ขายอาหารและเครื่องดื่ม"
                                style={errors.shopDescription ? { ...styles.input, ...styles.inputError } : styles.input}
                                disabled={isLoading}
                            />
                            {errors.shopDescription && (
                                <span style={styles.errorText}>{errors.shopDescription}</span>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>📞</span>
                                เบอร์โทรศัพท์
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0812345678"
                                style={errors.phone ? { ...styles.input, ...styles.inputError } : styles.input}
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <span style={styles.errorText}>{errors.phone}</span>
                            )}
                        </div>
                    </div>

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

                    {/* Confirm Password Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>🔐</span>
                            ยืนยันรหัสผ่าน
                        </label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={errors.confirmPassword ? { ...styles.input, ...styles.inputError } : styles.input}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.togglePassword}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span style={styles.errorText}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Terms */}
                    <div style={styles.terms}>
                        <label style={styles.checkbox}>
                            <input type="checkbox" required style={styles.checkboxInput} />
                            <span style={styles.checkboxLabel}>
                                ฉันยอมรับ{' '}
                                <a href="/terms" style={styles.link}>ข้อกำหนดการใช้งาน</a>
                                {' '}และ{' '}
                                <a href="/privacy" style={styles.link}>นโยบายความเป็นส่วนตัว</a>
                            </span>
                        </label>
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
                                กำลังสมัครสมาชิก...
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                สมัครสมาชิก
                            </>
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        มีบัญชีอยู่แล้ว?{' '}
                        <a href="/login" style={styles.signInLink}>
                            เข้าสู่ระบบ
                        </a>
                    </p>
                </div>
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
        maxWidth: '720px',
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
    formRow: {
        display: 'flex',
        gap: '16px',
        marginBottom: '0px',
    },
    formGroup: {
        marginBottom: '16px',
        flex: 1,
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
    terms: {
        marginBottom: '24px',
    },
    checkbox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        cursor: 'pointer',
    },
    checkboxInput: {
        marginTop: '4px',
        cursor: 'pointer',
    },
    checkboxLabel: {
        fontSize: '13px',
        color: '#555',
        lineHeight: '1.5',
    },
    link: {
        color: '#f5576c',
        textDecoration: 'none',
        fontWeight: '600',
    },
    submitButton: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
    signInLink: {
        color: '#f5576c',
        textDecoration: 'none',
        fontWeight: '600',
    },
};
