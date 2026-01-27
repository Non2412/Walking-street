/**
 * Bookings Page - หน้าจัดการการจองพื้นที่
 * แสดงแผนผังบูธแบบแถวนอน (Horizontal Rows)
 */

'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';

// ... (other imports)

// ... inside component function BookingsContent() ...
// But I cannot inject inside function easily without seeing context.
// Let's add the import first.
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import Script from 'next/script';

// Modal Styles
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(5px)',
    },
    content: {
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        animation: 'slideUp 0.3s ease-out',
    }
};

function BookingsContent() {
    const { user } = useAuth();
    const [selectedDates, setSelectedDates] = useState([]); // Array of date strings
    const [openDates, setOpenDates] = useState([]);
    const [isDatesLoading, setIsDatesLoading] = useState(true);

    // Fetch Open Dates
    React.useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.openDates && data.data.openDates.length > 0) {
                    // Sort dates from nearest to future
                    const sorted = data.data.openDates.sort((a, b) => new Date(a) - new Date(b));
                    setOpenDates(sorted);
                    setSelectedDates([sorted[0]]); // Select first available day by default
                } else {
                    setOpenDates([]);
                }
                setIsDatesLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsDatesLoading(false);
            });
    }, []);

    const [selectedBooths, setSelectedBooths] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);

    // Booking Flow State
    const [bookingStep, setBookingStep] = useState(1);
    const [bookingDetails, setBookingDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: ''
    });
    const [myBookings, setMyBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]); // Store all bookings to check availability

    // Fetch All Bookings to check status - only when token is available
    React.useEffect(() => {
        const token = localStorage.getItem('market_token');
        
        // Don't fetch if no token
        if (!token) {
            console.log('⏭️ No token - skipping bookings fetch');
            return;
        }

        console.log('✅ Token found - starting bookings fetch');

        const fetchAllBookings = async () => {
            try {
                // Double-check token before fetching
                const currentToken = localStorage.getItem('market_token');
                if (!currentToken) {
                    console.log('⏭️ Token lost during fetch');
                    return;
                }
                
                const res = await fetch('/api/bookings', {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`
                    }
                });
                
                if (!res.ok) {
                    console.log(`⚠️ Fetch failed with status ${res.status}`);
                    return;
                }
                
                const data = await res.json();
                if (data.success) {
                    setAllBookings(data.data);
                    console.log(`✅ Fetched ${data.data?.length || 0} bookings`);
                }
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            }
        };

        // Fetch immediately on token arrival
        fetchAllBookings();
        
        // Only set interval if token exists - refresh every 15 seconds
        const interval = setInterval(fetchAllBookings, 15000);
        return () => clearInterval(interval);
    }, [user]);

    // Check booth status (Multi-date aware)
    const getBoothStatus = (boothId) => {
        if (selectedDates.length === 0) return null;

        // Find if this booth is booked on ANY of the selected dates
        // Support backward compatibility (b.targetDate) and new format (b.targetDates)
        const booking = allBookings.find(b => {
            if (!b.booths || !b.booths.includes(boothId)) return false;
            if (!['approved', 'pending', 'waiting_for_payment'].includes(b.status)) return false;

            const bDates = b.targetDates || (b.targetDate ? [b.targetDate] : []);
            // Check overlap
            return bDates.some(date => selectedDates.includes(date));
        });

        if (booking) {
            return {
                isBooked: true,
                status: booking.status,
                ownerName: booking.name || 'จองแล้ว'
            };
        }
        return null;
    };

    // Timer State
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [currentBookingId, setCurrentBookingId] = useState(null); // Keep track of current booking

    // Timer Logic
    React.useEffect(() => {
        let timer;
        if (showBookingModal && bookingStep === 2 && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Time out!
            setShowBookingModal(false);
            setSelectedBooths([]);
            setShowTimeoutModal(true); // Show custom modal
            setBookingStep(1);
        }

        return () => clearInterval(timer);
    }, [showBookingModal, bookingStep, timeLeft]);

    // Reset Timer when opening modal
    React.useEffect(() => {
        if (showBookingModal) {
            setTimeLeft(300); // Reset to 5 minutes
        }
    }, [showBookingModal]);

    // Format time mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Update booking details when user loads
    React.useEffect(() => {
        if (user) {
            setBookingDetails(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || user.phoneNumber || ''
            }));
        }
    }, [user]);

    const [uploadPreview, setUploadPreview] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isVerifyingSlip, setIsVerifyingSlip] = useState(false);
    const [slipVerificationStatus, setSlipVerificationStatus] = useState(null); // 'success', 'failed', 'error'

    const searchParams = useSearchParams();

    // Check for resume payment
    React.useEffect(() => {
        const paymentId = searchParams.get('paymentId');
        if (paymentId && user) {
            // Fetch booking details
            const token = localStorage.getItem('market_token');
            fetch('/api/bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    if (data.success) {
                        const booking = data.data.find(b => b.id === paymentId);
                        if (booking && booking.status === 'waiting_for_payment') {
                            setCurrentBookingId(booking.id);

                            // Restore booths
                            const restoredBooths = [];
                            ['A', 'B', 'C'].forEach(zone => {
                                if (boothsData[zone]) {
                                    boothsData[zone].forEach(b => {
                                        if (booking.booths && booking.booths.includes(b.id)) {
                                            restoredBooths.push(b);
                                        }
                                    });
                                }
                            });

                            if (restoredBooths.length > 0) {
                                setSelectedBooths(restoredBooths);
                                setBookingStep(2);
                                setShowBookingModal(true);
                            }
                        }
                    }
                });
        }
    }, [searchParams, user]);


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // OCR Verification
            if (window.Tesseract) {
                setIsVerifyingSlip(true);
                setSlipVerificationStatus(null);
                try {
                    const result = await window.Tesseract.recognize(
                        file,
                        'eng', // English is usually enough for numbers
                        // { logger: m => console.log(m) }
                    );

                    const text = result.data.text.replace(/,/g, ''); // Remove commas
                    const total = getTotalPrice(); // Check against total price

                    // Simple check: Is the total amount string present in the text?
                    // We check for exact match of the number, or formatted with 2 decimals
                    const hasTotal = text.includes(total.toString()) || text.includes(total.toFixed(2));

                    if (hasTotal) {
                        setSlipVerificationStatus('success');
                    } else {
                        console.warn('OCR Text:', text);
                        setSlipVerificationStatus('failed');
                    }
                } catch (error) {
                    console.error('OCR Error:', error);
                    setSlipVerificationStatus('error');
                } finally {
                    setIsVerifyingSlip(false);
                }
            } else {
                console.warn('Tesseract not loaded yet');
            }
        }
    };

    // สร้างข้อมูลบูธตามวันที่เลือก (ใช้ useMemo เพื่อไม่ให้สุ่มใหม่ทุกครั้ง)
    const boothsData = React.useMemo(() => {
        const booths = {
            A: [],
            B: [],
            C: [],
        };

        // กำหนดจำนวนช่องตามวัน (สมดุลกันมากขึ้น)
        // This logic needs to be updated if booth counts vary by date.
        // For now, assuming a fixed structure or a structure based on the *first* selected date if multiple.
        // Or, if all selected dates have the same booth structure, this is fine.
        // If booth structure changes per date, this memoization needs to be more complex.
        const counts = selectedDates.length > 0 && selectedDates[0].includes('saturday') // Assuming 'saturday' in date string
            ? { A: 10, B: 20, C: 10 }  // วันเสาร์: 40 ช่อง (10+20+10)
            : { A: 30, B: 40, C: 30 }; // วันอาทิตย์: 100 ช่อง (30+40+30)


        // Zone A (฿500)
        for (let i = 1; i <= counts.A; i++) {
            const id = `A-${String(i).padStart(2, '0')}`;
            const rand = (i * 7) % 10; // ใช้ pattern แทน random

            // Check if booked by current user
            const isMyBooking = myBookings.includes(id);

            booths.A.push({
                id,
                zone: 'A',
                price: 500,
                status: 'available', // Clean default
                bookedBy: null,
                isMyBooking: false
            });
        }

        // Zone B (฿700)
        for (let i = 1; i <= counts.B; i++) {
            const id = `B-${String(i).padStart(2, '0')}`;
            booths.B.push({
                id,
                zone: 'B',
                price: 700,
                status: 'available', // Clean default
                bookedBy: null,
                isMyBooking: false
            });
        }

        // Zone C (฿1000)
        for (let i = 1; i <= counts.C; i++) {
            const id = `C-${String(i).padStart(2, '0')}`;
            booths.C.push({
                id,
                zone: 'C',
                price: 1000,
                status: 'available', // Clean default
                bookedBy: null,
                isMyBooking: false
            });
        }

        return booths;
    }, [selectedDates]); // Update when selectedDates change

    // Helper: isSelected?
    const isBoothSelected = (id) => selectedBooths.some(b => b.id === id);

    const allBooths = [...boothsData.A, ...boothsData.B, ...boothsData.C];

    // Calculate Stats based on API status
    const stats = {
        total: allBooths.length,
        available: allBooths.length, // Client-side base count
        booked: 0,
        pending: 0
    };

    // Update stats dynamically based on API data if needed, 
    // but for now UI uses dynamic getBoothStatus. 
    // To make stats accurate, we should count from allBookings based on selectedDates.
    if (selectedDates.length > 0) {
        // Count booths that are booked on ANY selected date
        // This is complex on client side without iterating booths.
        // Simplified: render logic handles the lock display.
    }


    const handleBoothClick = (booth) => {
        // Validation 1: API Status Check
        const apiStatus = getBoothStatus(booth.id);
        if (apiStatus && apiStatus.isBooked) return;

        // Toggle Selection
        if (isBoothSelected(booth.id)) {
            setSelectedBooths(prev => prev.filter(b => b.id !== booth.id));
        } else {
            // Check Limit
            if (selectedBooths.length >= 2) {
                setShowLimitModal(true);
                return;
            }
            setSelectedBooths(prev => [...prev, booth]);
        }
    };



    const getStatusIcon = (status, isSelected) => {
        if (isSelected) return '✓';
        switch (status) {
            case 'available': return '';
            case 'booked': return '🔒';
            case 'pending': return '⏳';
            default: return '';
        }
    };

    const getStatusColor = (status, isSelected) => {
        if (isSelected) return '#fff';
        switch (status) {
            case 'available': return '#27ae60';
            case 'booked': return '#e74c3c';
            case 'pending': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    const getTotalPrice = () => {
        return selectedBooths.reduce((sum, booth) => sum + booth.price, 0);
    };

    return (
        <div className={styles.pageContainer} >
            <Navbar />

            <div className={styles.container}>
                <div className={styles.layoutWrapper}>
                    <div className={styles.mainContent}>
                        {/* Welcome Section */}
                        <div className={styles.welcomeSection}>
                            <div>
                                <h1 className={styles.welcomeTitle}>
                                    สวัสดี, {user?.name}! 👋
                                </h1>
                                <p className={styles.welcomeSubtitle}>
                                    ยินดีต้อนรับสู่ระบบจัดการตลาดถนนคนเดินศรีสะเกษ
                                </p>
                                <button
                                    onClick={() => window.location.href = '/user-dashboard'}
                                    style={{
                                        marginTop: '16px',
                                        padding: '10px 20px',
                                        backgroundColor: '#fff',
                                        color: '#667eea',
                                        border: '1px solid #667eea',
                                        borderRadius: '30px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#667eea';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fff';
                                        e.currentTarget.style.color = '#667eea';
                                    }}
                                >
                                    📊 ติดตามสถานะการจองของคุณ
                                </button>
                            </div>
                            <div className={styles.dateSection}>
                                <span className={styles.dateText}>
                                    📅 {new Date().toLocaleDateString('th-TH', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Day Selection */}
                        <div className={styles.dayButtons}>
                            {isDatesLoading ? (
                                <div style={{ color: '#666' }}>กำลังโหลดตารางจอง...</div>
                            ) : openDates.length === 0 ? (
                                <div style={{ color: '#e74c3c' }}>ยังไม่มีรอบการจองที่เปิดในขณะนี้</div>
                            ) : (
                                openDates.map(dateStr => {
                                    const date = new Date(dateStr);
                                    const isSelected = selectedDates.includes(dateStr);
                                    return (
                                        <button
                                            key={dateStr}
                                            className={`${styles.dayButton} ${isSelected ? styles.dayButtonActive : ''}`}
                                            style={{
                                                backgroundColor: isSelected ? '#667eea' : '#f8f9fa',
                                                color: isSelected ? '#fff' : '#666',
                                                minWidth: '140px',
                                                border: isSelected ? '2px solid #5a67d8' : '1px solid #e2e8f0',
                                                position: 'relative'
                                            }}
                                            onClick={() => {
                                                // Toggle Selection
                                                if (selectedDates.includes(dateStr)) {
                                                    // Allow unselect only if more than 1 is selected
                                                    if (selectedDates.length > 1) {
                                                        setSelectedDates(prev => prev.filter(d => d !== dateStr));
                                                        setSelectedBooths([]); // Reset booths on change
                                                    }
                                                } else {
                                                    setSelectedDates(prev => [...prev, dateStr].sort()); // Keep sorted
                                                    setSelectedBooths([]); // Reset booths on change
                                                }
                                            }}
                                        >
                                            {isSelected && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#e74c3c', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>}
                                            <span className={styles.dayIcon}>📅</span>
                                            <span className={styles.dayText}>
                                                {date.toLocaleDateString('th-TH', { weekday: 'long' })}
                                            </span>
                                            <span className={styles.daySubtext}>
                                                {date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Statistics */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#3498db' }}>📊</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.total}</div>
                                    <div className={styles.statLabel}>ทั้งหมด</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#27ae60' }}>✓</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.available}</div>
                                    <div className={styles.statLabel}>ว่าง</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#e74c3c' }}>🔒</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.booked}</div>
                                    <div className={styles.statLabel}>จองแล้ว</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: '#f39c12' }}>⏳</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stats.pending}</div>
                                    <div className={styles.statLabel}>รอชำระ</div>
                                </div>
                            </div>
                        </div>

                        {/* Area Map */}
                        <div className={styles.mapSection}>
                            <h2 className={styles.mapTitle}>แผนผังพื้นที่</h2>

                            {/* Zone A */}
                            <div className={styles.zoneSection}>
                                <div className={styles.boothRow}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneA').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneA">
                                        {boothsData.A.map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            const apiStatus = getBoothStatus(booth.id);
                                            const isBooked = apiStatus && apiStatus.isBooked;

                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={styles.boothCard}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : (isBooked ? '#ef9a9a' : '#27ae60'),
                                                        backgroundColor: isSelected ? '#3498db' : (isBooked ? '#ffebee' : '#fff'),
                                                        color: isSelected ? '#fff' : (isBooked ? '#c62828' : 'inherit'),
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : '',
                                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                                    }}
                                                    onClick={() => !isBooked && handleBoothClick(booth)}
                                                >
                                                    {isBooked ? (
                                                        <>
                                                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔒</div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {apiStatus.ownerName}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                            <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneA').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>
                            </div>

                            {/* Zone B */}
                            <div className={styles.zoneSection}>
                                <div className={styles.zoneHeader} style={{ backgroundColor: '#95a5a6' }}>
                                    <span>🚶 ทางเดิน</span>
                                </div>

                                <div className={styles.boothRow}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB1').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneB1">
                                        {boothsData.B.slice(0, Math.ceil(boothsData.B.length / 2)).map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            const apiStatus = getBoothStatus(booth.id);
                                            const isBooked = apiStatus && apiStatus.isBooked;

                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={styles.boothCard}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : (isBooked ? '#ef9a9a' : '#f39c12'),
                                                        backgroundColor: isSelected ? '#3498db' : (isBooked ? '#ffebee' : '#fff'),
                                                        color: isSelected ? '#fff' : (isBooked ? '#c62828' : 'inherit'),
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : '',
                                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                                    }}
                                                    onClick={() => !isBooked && handleBoothClick(booth)}
                                                >
                                                    {isBooked ? (
                                                        <>
                                                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔒</div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {apiStatus.ownerName}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                            <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB1').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>

                                <div className={styles.boothRow} style={{ marginTop: '12px' }}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB2').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneB2">
                                        {boothsData.B.slice(Math.ceil(boothsData.B.length / 2)).map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            const apiStatus = getBoothStatus(booth.id);
                                            const isBooked = apiStatus && apiStatus.isBooked;

                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={styles.boothCard}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : (isBooked ? '#ef9a9a' : '#f39c12'),
                                                        backgroundColor: isSelected ? '#3498db' : (isBooked ? '#ffebee' : '#fff'),
                                                        color: isSelected ? '#fff' : (isBooked ? '#c62828' : 'inherit'),
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : '',
                                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                                    }}
                                                    onClick={() => !isBooked && handleBoothClick(booth)}
                                                >
                                                    {isBooked ? (
                                                        <>
                                                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔒</div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {apiStatus.ownerName}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                            <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneB2').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>
                            </div>

                            {/* Zone C */}
                            <div className={styles.zoneSection}>
                                <div className={styles.zoneHeader} style={{ backgroundColor: '#95a5a6' }}>
                                    <span>🚶 ทางเดิน</span>
                                </div>
                                <div className={styles.boothRow}>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneC').scrollBy({ left: -200, behavior: 'smooth' })}>‹</button>
                                    <div className={styles.boothScroll} id="zoneC">
                                        {boothsData.C.map(booth => {
                                            const isSelected = isBoothSelected(booth.id);
                                            const apiStatus = getBoothStatus(booth.id);
                                            const isBooked = apiStatus && apiStatus.isBooked;

                                            return (
                                                <div
                                                    key={booth.id}
                                                    className={styles.boothCard}
                                                    style={{
                                                        borderColor: isSelected ? '#3498db' : (isBooked ? '#ef9a9a' : '#3498db'),
                                                        backgroundColor: isSelected ? '#3498db' : (isBooked ? '#ffebee' : '#fff'),
                                                        color: isSelected ? '#fff' : (isBooked ? '#c62828' : 'inherit'),
                                                        transform: isSelected ? 'scale(1.05)' : 'none',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(52, 152, 219, 0.4)' : '',
                                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                                    }}
                                                    onClick={() => !isBooked && handleBoothClick(booth)}
                                                >
                                                    {isBooked ? (
                                                        <>
                                                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔒</div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {apiStatus.ownerName}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={styles.boothNumber} style={{ color: isSelected ? '#fff' : undefined }}>{booth.id}</div>
                                                            <div className={styles.boothPrice} style={{ color: isSelected ? '#fff' : undefined }}>฿{booth.price}</div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button className={styles.scrollButton} onClick={() => document.getElementById('zoneC').scrollBy({ left: 200, behavior: 'smooth' })}>›</button>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className={styles.legend}>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ backgroundColor: '#27ae60' }}></span>
                                    <span>สีเขียว: ว่าง (Available)</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ backgroundColor: '#e74c3c' }}></span>
                                    <span>สีแดง: จองแล้ว (Booked)</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ backgroundColor: '#f39c12' }}></span>
                                    <span>สีส้ม: รอชำระ (Pending)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Selected Booths */}
                    <div className={styles.sidebar}>
                        <h3 className={styles.sidebarTitle}>รายการที่เลือก ({selectedBooths.length})</h3>

                        <div className={styles.selectedList}>
                            {selectedBooths.length === 0 ? (
                                <div className={styles.emptySelection}>
                                    ยังไม่ได้เลือกบูธ
                                    <br />
                                    คลิกที่บูธเพื่อเลือก
                                </div>
                            ) : (
                                selectedBooths.map(booth => (
                                    <div key={booth.id} className={styles.selectedItem}>
                                        <div className={styles.selectedItemInfo}>
                                            <span className={styles.selectedItemName}>บูธ {booth.id} ({booth.zone})</span>
                                            <span className={styles.selectedItemPrice}>฿{booth.price.toLocaleString()}</span>
                                        </div>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleBoothClick(booth)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className={styles.sidebarFooter}>
                            <div className={styles.totalPrice}>
                                <span>ยอดรวม</span>
                                <span style={{ color: '#27ae60' }}>฿{getTotalPrice().toLocaleString()}</span>
                            </div>
                            <button
                                className={styles.confirmButton}
                                disabled={selectedBooths.length === 0}
                                style={{ width: '100%', opacity: selectedBooths.length === 0 ? 0.5 : 1, cursor: selectedBooths.length === 0 ? 'not-allowed' : 'pointer' }}
                                onClick={() => {
                                    setBookingStep(1);
                                    setShowBookingModal(true);
                                }}
                            >
                                ยืนยันการจอง
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking Process Modal */}
                {showBookingModal && selectedBooths.length > 0 && (
                    <div className={styles.modal} onClick={() => setShowBookingModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%' }}>
                            {bookingStep === 1 ? (
                                /* Step 1: User Details */
                                <div className={styles.stepContainer}>
                                    <h3 className={styles.stepTitle}>ยืนยันการจอง</h3>

                                    <div className={styles.stepLayout}>
                                        {/* Left: Summary */}
                                        <div className={styles.summarySection}>
                                            <div className={styles.sectionHeader}>
                                                <span>📋</span> สรุปรายการ
                                            </div>

                                            <div className={styles.modalSummaryList}>
                                                {selectedBooths.map(b => (
                                                    <div key={b.id} className={styles.summaryItem}>
                                                        <span>บูธ {b.id} ({b.zone})</span>
                                                        <span>฿{b.price}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={styles.summaryTotal}>
                                                <span>รวมทั้งสิ้น</span>
                                                <span className={styles.summaryTotalValue}>฿{getTotalPrice().toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Right: Form */}
                                        <div className={styles.formSection}>
                                            <div className={styles.sectionHeader}>
                                                <span>👤</span> ข้อมูลผู้จอง
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>ชื่อ-นามสกุล</label>
                                                <input
                                                    type="text"
                                                    value={bookingDetails.name}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                                                    className={styles.inputField}
                                                    placeholder="กรอกชื่อ-นามสกุล"
                                                />
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>อีเมล</label>
                                                <input
                                                    type="email"
                                                    value={bookingDetails.email}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                                                    className={styles.inputField}
                                                    placeholder="กรอกอีเมล"
                                                />
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>เบอร์โทรศัพท์</label>
                                                <input
                                                    type="tel"
                                                    value={bookingDetails.phone}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                                                    className={styles.inputField}
                                                    placeholder="กรอกเบอร์โทรศัพท์"
                                                />
                                            </div>

                                            <div className={styles.inputGroup}>
                                                <label className={styles.inputLabel}>วิธีการชำระเงิน</label>
                                                <div className={styles.paymentMethods}>
                                                    <button className={`${styles.paymentButton} ${styles.paymentButtonActive}`}>
                                                        PromptPay
                                                    </button>
                                                    <button className={styles.paymentButton} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                        Credit Card
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.modalButtons} style={{ marginTop: 'auto' }}>
                                                <button className={styles.cancelButton} onClick={() => setShowBookingModal(false)}>ยกเลิก</button>
                                                <button
                                                    className={styles.confirmButton}
                                                    onClick={async () => {
                                                        // Create Booking Logic
                                                        try {
                                                            const token = localStorage.getItem('market_token');
                                                            const res = await fetch('/api/bookings', {
                                                                method: 'POST',
                                                                headers: { 
                                                                    'Content-Type': 'application/json',
                                                                    'Authorization': `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({
                                                                    storeName: bookingDetails.name,
                                                                    ownerName: bookingDetails.name,
                                                                    shopType: 'food',
                                                                    email: bookingDetails.email,
                                                                    phone: bookingDetails.phone,
                                                                    stallNumber: selectedBooths[0]?.id || 'A-01',
                                                                    bookingDate: selectedDates[0] || new Date().toISOString().split('T')[0],
                                                                    booths: selectedBooths.map(b => b.id),
                                                                    totalPrice: getTotalPrice(),
                                                                    paymentMethod: 'promptpay',
                                                                    status: 'pending',
                                                                    targetDates: selectedDates
                                                                })
                                                            });

                                                            if (!res.ok) {
                                                                const errorText = await res.text();
                                                                console.error('API Error:', res.status, errorText);
                                                                alert(`เกิดข้อผิดพลาด (${res.status}): ไม่สามารถบันทึกข้อมูลการจองได้`);
                                                                return;
                                                            }

                                                            const data = await res.json();
                                                            if (data.success) {
                                                                const bookingId = data.data._id || data.data.id;
                                                                console.log('✅ Booking created with ID:', bookingId);
                                                                setCurrentBookingId(bookingId); // Save ID for step 2
                                                                setBookingStep(2);
                                                            } else {
                                                                alert('เกิดข้อผิดพลาดในการจอง: ' + (data.error || 'Unknown error'));
                                                            }
                                                        } catch (err) {
                                                            console.error('Exception:', err);
                                                            alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้: ' + err.message);
                                                        }
                                                    }}
                                                    style={{ opacity: (!bookingDetails.name || !bookingDetails.phone) ? 0.5 : 1 }}
                                                    disabled={!bookingDetails.name || !bookingDetails.phone}
                                                >
                                                    ดำเนินการต่อ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Step 2: Payment & Upload */
                                <div className={styles.stepContainer}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 className={styles.stepTitle} style={{ margin: 0 }}>การชำระเงิน</h3>
                                        <div style={{
                                            backgroundColor: timeLeft < 60 ? '#fee2e2' : '#f3f4f6',
                                            color: timeLeft < 60 ? '#ef4444' : '#374151',
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span>⏱️ เหลือเวลาชำระเงิน</span>
                                            <span style={{ fontSize: '18px', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
                                        </div>
                                    </div>

                                    <div className={styles.stepLayout}>
                                        {/* Left: Summary */}
                                        <div className={styles.summarySection}>
                                            <div className={styles.sectionHeader}>
                                                <span>💰</span> รายละเอียดการชำระ
                                            </div>

                                            <div style={{ marginBottom: '24px' }}>
                                                <div className={styles.summaryItem}>
                                                    <span>จำนวนบูธที่จอง</span>
                                                    <span style={{ fontWeight: 'bold' }}>{selectedBooths.length} บูธ</span>
                                                </div>
                                                <div className={styles.summaryTotal}>
                                                    <span>ยอดชำระเงิน</span>
                                                    <span className={styles.summaryTotalValue}>฿{getTotalPrice().toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Bank Details Card */}
                                            <div className={styles.bankCard}>
                                                <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                                    <img
                                                        src="/img/promptpay.png"
                                                        alt="PromptPay QR Code"
                                                        style={{ width: '100%', maxWidth: '220px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                                    />
                                                    <div style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>สแกนเพื่อชำระเงิน</div>
                                                </div>
                                                <div className={styles.bankHeader}>
                                                    <div className={styles.bankIcon}>🏦</div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>ธนาคารกรุงไทย</div>
                                                        <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Walking Street Market</div>
                                                    </div>
                                                </div>
                                                <div className={styles.accountNumber}>115-x-xxxxx-x</div>
                                                <div className={styles.accountName}>ชื่อบัญชี: แพลนเน็ท เทศวินทร์</div>
                                            </div>
                                        </div>

                                        {/* Right: Upload Slip */}
                                        <div className={styles.formSection} style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div className={styles.sectionHeader}>
                                                <span>🧾</span> หลักฐานการโอน
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <label className={styles.inputLabel} style={{ marginBottom: '8px', display: 'block' }}>ระบุจำนวนเงินที่โอน</label>
                                                <input
                                                    type="number"
                                                    value={paymentAmount}
                                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                                    className={styles.inputField}
                                                    placeholder="0.00"
                                                    style={{ width: '100%' }}
                                                />
                                            </div>


                                            <label className={styles.uploadBox}>
                                                <input
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {uploadPreview ? (
                                                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                                        <img
                                                            src={uploadPreview}
                                                            alt="Slip Preview"
                                                            style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'contain' }}
                                                        />

                                                        {isVerifyingSlip && (
                                                            <div style={{ marginTop: '8px', color: '#f39c12' }}>⏳ กำลังตรวจสอบสลิป...</div>
                                                        )}

                                                        {!isVerifyingSlip && slipVerificationStatus === 'success' && (
                                                            <div style={{ marginTop: '8px', color: '#2ecc71', fontWeight: 'bold' }}>✅ พบยอดเงินถูกต้อง</div>
                                                        )}

                                                        {!isVerifyingSlip && slipVerificationStatus === 'failed' && (
                                                            <div style={{ marginTop: '8px', color: '#e74c3c' }}>⚠️ ไม่พบยอดเงินที่ตรงกัน (กรุณาตรวจสอบ)</div>
                                                        )}

                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '10px',
                                                            background: 'rgba(0,0,0,0.6)',
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px'
                                                        }}>
                                                            คลิกเพื่อเปลี่ยนรูป
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className={styles.uploadIcon}>☁️</div>
                                                        <div className={styles.uploadText}>อัปโหลดสลิปโอนเงิน</div>
                                                        <div className={styles.uploadHint}>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</div>
                                                    </>
                                                )}
                                            </label>

                                            <div className={styles.modalButtons} style={{ marginTop: '24px' }}>
                                                <button className={styles.cancelButton} onClick={() => setBookingStep(1)}>ย้อนกลับ</button>
                                                <button
                                                    className={styles.confirmButton}
                                                    onClick={async () => {
                                                        const total = getTotalPrice();
                                                        if (parseFloat(paymentAmount) !== total) {
                                                            alert(`ยอดเงินไม่ถูกต้อง กรุณาระบุจำนวนเงินให้ตรงกับยอดชำระ (${total.toLocaleString()} บาท)`);
                                                            return;
                                                        }

                                                        if (!uploadPreview) {
                                                            alert('กรุณาแนบหลักฐานการโอนเงิน');
                                                            return;
                                                        }

                                                        if (slipVerificationStatus === 'failed') {
                                                            const confirm = window.confirm('ระบบไม่พบยอดเงินที่ตรงกันในสลิป คุณยืนยันที่จะส่งข้อมูลหรือไม่?');
                                                            if (!confirm) return;
                                                        }

                                                        // API Call to Update Status
                                                        try {
                                                            const token = localStorage.getItem('market_token');
                                                            
                                                            if (!currentBookingId) {
                                                                alert('ไม่พบหมายเลขการจอง กรุณาลองใหม่อีกครั้ง');
                                                                return;
                                                            }
                                                            
                                                            const res = await fetch(`/api/bookings/${currentBookingId}`, {
                                                                method: 'PUT',
                                                                headers: { 
                                                                    'Content-Type': 'application/json',
                                                                    'Authorization': `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({
                                                                    status: 'completed',
                                                                    paymentSlip: uploadPreview, // Base64 string
                                                                    price: parseFloat(paymentAmount)
                                                                })
                                                            });

                                                            if (!res.ok) {
                                                                const errorText = await res.text();
                                                                console.error('Payment API Error:', res.status, errorText);
                                                                alert(`เกิดข้อผิดพลาด (${res.status}): ไม่สามารถบันทึกข้อมูลการชำระเงินได้`);
                                                                return;
                                                            }

                                                            const data = await res.json();
                                                            if (data.success) {
                                                                alert('จองสำเร็จ! กรุณารอการตรวจสอบจากแอดมิน');

                                                                // Add to local state strictly for UI feedback if needed, but better to rely on API fetch
                                                                setMyBookings(prev => [...prev, ...selectedBooths.map(b => b.id)]);

                                                                // Clear state
                                                                setUploadPreview(null);
                                                                setPaymentAmount('');
                                                                setShowBookingModal(false);
                                                                setSelectedBooths([]);
                                                            } else {
                                                                alert('เกิดข้อผิดพลาด: ' + (data.message || data.error || 'Unknown error'));
                                                            }
                                                        } catch (err) {
                                                            console.error('Submission Error:', err);
                                                            alert('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง: ' + err.message);
                                                        }
                                                    }}
                                                >
                                                    แจ้งชำระเงิน
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Limit Warning Modal */}
                {showLimitModal && (
                    <div className={styles.modal} onClick={() => setShowLimitModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                            <h3 style={{ color: '#e74c3c' }}>แจ้งเตือน</h3>
                            <p style={{ margin: '16px 0', fontSize: '16px' }}>คุณสามารถเลือกจองได้สูงสุด 3 บูธต่อครั้งเท่านั้น</p>
                            <button
                                className={styles.confirmButton}
                                onClick={() => setShowLimitModal(false)}
                                style={{ width: '100%', marginTop: '8px' }}
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Load Tesseract.js from CDN */}
            <Script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js" strategy="lazyOnload" />
            {/* Timeout Modal */}
            {showTimeoutModal && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'shake 0.5s' }}>⏳</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#e74c3c' }}>
                            หมดเวลาทำรายการ
                        </h2>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                            เวลาในการชำระเงินของคุณหมดแล้ว<br />
                            กรุณาเลือกพื้นที่และทำรายการใหม่อีกครั้ง
                        </p>
                        <button
                            onClick={() => setShowTimeoutModal(false)}
                            style={{
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                padding: '10px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)'
                            }}
                        >
                            รับทราบ
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
}

export default function BookingsPage() {
    return (
        <ProtectedRoute>
            <BookingsContent />
        </ProtectedRoute>
    );
}
