'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import styles from './auth-form.module.css';

export default function SignupForm() {
    const router = useRouter();
    const { signup } = useMarketAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!formData.fullName) newErrors.fullName = 'Full name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        const result = await signup(
            formData.username,
            formData.email,
            formData.password,
            formData.fullName
        );

        setLoading(false);

        if (result.success) {
            alert('✅ Signup successful!');
            router.push('/booking');
        } else {
            setErrors({ submit: result.error });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            {errors.submit && <div className={styles.error}>{errors.submit}</div>}

            <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.fullName ? styles.inputError : ''}
                />
                {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={errors.username ? styles.inputError : ''}
                />
                {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordInput}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={errors.password ? styles.inputError : ''}
                    />
                    <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
            >
                {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className={styles.loginLink}>
                Already have an account? <a href="/login">Login here</a>
            </div>
        </form>
    );
}
