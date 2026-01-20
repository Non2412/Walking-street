'use client';

import { useState, useRef } from 'react';
import styles from './image-upload.module.css';

export default function ImageUpload({ onUpload, label = 'Upload Payment Slip' }) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app';

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.[0]) {
            setError('Please select a file');
            return;
        }

        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setPreview(null);
            fileInputRef.current.value = '';

            if (onUpload) {
                onUpload(data.data.url);
            }

            alert('✅ Image uploaded successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.container}>
            <h3>{label}</h3>

            <div className={styles.uploadArea}>
                {preview ? (
                    <div className={styles.preview}>
                        <img src={preview} alt="Preview" />
                    </div>
                ) : (
                    <label className={styles.label}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <div className={styles.content}>
                            <p className={styles.icon}>📷</p>
                            <p>Click to select image or drag and drop</p>
                            <p className={styles.hint}>PNG, JPG, GIF (max 5MB)</p>
                        </div>
                    </label>
                )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {preview && (
                <div className={styles.actions}>
                    <button
                        className={styles.uploadBtn}
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : '⬆️ Upload'}
                    </button>
                    <button
                        className={styles.cancelBtn}
                        onClick={handleClear}
                        disabled={loading}
                    >
                        ✕ Cancel
                    </button>
                </div>
            )}

            {!preview && (
                <label className={styles.selectBtn}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    📁 Select File
                </label>
            )}
        </div>
    );
}
