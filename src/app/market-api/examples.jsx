/**
 * ตัวอย่างการใช้งาน Market API Client
 * คัดลอกโค้ดนี้ไปใช้ในโปรเจคของคุณได้เลย
 */

'use client';

import BookingList from './components/BookingList';
import BookingForm from './components/BookingForm';
import { useBookings, useBookingsByStatus } from './hooks/useBookings';
import { BOOKING_STATUS } from './types/booking';

// ========================================
// ตัวอย่างที่ 1: แสดงรายการจองทั้งหมด
// ========================================
export function Example1_AllBookings() {
    return (
        <div>
            <h1>รายการจองทั้งหมด</h1>
            <BookingList />
        </div>
    );
}

// ========================================
// ตัวอย่างที่ 2: แสดงเฉพาะการจองที่รออนุมัติ
// ========================================
export function Example2_PendingBookings() {
    return (
        <div>
            <h1>รายการรออนุมัติ</h1>
            <BookingList filterStatus={BOOKING_STATUS.PENDING} />
        </div>
    );
}

// ========================================
// ตัวอย่างที่ 3: ฟอร์มสร้างการจองใหม่
// ========================================
export function Example3_CreateBooking() {
    const handleSuccess = (newBooking) => {
        console.log('สร้างการจองสำเร็จ:', newBooking);
    };

    return (
        <div>
            <h1>สร้างการจองใหม่</h1>
            <BookingForm onSuccess={handleSuccess} />
        </div>
    );
}

// ========================================
// ตัวอย่างที่ 4: Dashboard แบบเต็ม
// ========================================
export function Example4_FullDashboard() {
    const { bookings, loading } = useBookings();

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        approved: bookings.filter(b => b.status === 'approved').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>📊 Dashboard การจองพื้นที่ตลาด</h1>

            {/* สถิติ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <StatCard title="ทั้งหมด" value={stats.total} color="#3498db" />
                <StatCard title="รออนุมัติ" value={stats.pending} color="#FFA500" />
                <StatCard title="อนุมัติแล้ว" value={stats.approved} color="#4CAF50" />
                <StatCard title="ปฏิเสธ" value={stats.rejected} color="#F44336" />
            </div>

            {/* ฟอร์มและรายการ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                <div>
                    <BookingForm />
                </div>
                <div>
                    <BookingList />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }) {
    return (
        <div style={{
            backgroundColor: color,
            color: '#fff',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
        }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{value}</p>
        </div>
    );
}

// ========================================
// ตัวอย่างที่ 5: ใช้ Hook แบบ Custom
// ========================================
export function Example5_CustomHook() {
    const { bookings, loading, error, createBooking, updateBookingStatus } = useBookings();

    const handleCreateBooking = async () => {
        try {
            const newBooking = await createBooking({
                storeName: 'ร้านทดสอบ',
                ownerName: 'นายทดสอบ',
                phone: '0812345678',
                email: 'test@example.com',
                shopType: 'food',
                stallNumber: 'A99',
                bookingDate: '2025-02-01',
            });
            console.log('สร้างสำเร็จ:', newBooking);
        } catch (err) {
            console.error('เกิดข้อผิดพลาด:', err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await updateBookingStatus(id, 'approved');
            console.log('อนุมัติสำเร็จ');
        } catch (err) {
            console.error('เกิดข้อผิดพลาด:', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <button onClick={handleCreateBooking}>สร้างการจองทดสอบ</button>

            <ul>
                {bookings.map(booking => (
                    <li key={booking._id}>
                        {booking.storeName} - {booking.status}
                        {booking.status === 'pending' && (
                            <button onClick={() => handleApprove(booking._id)}>อนุมัติ</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ========================================
// ตัวอย่างที่ 6: ใช้ Service โดยตรง
// ========================================
import bookingService from './services/bookingService';

export async function Example6_DirectService() {
    try {
        // ดึงข้อมูลทั้งหมด
        const allBookings = await bookingService.getAll();
        console.log('All bookings:', allBookings);

        // ดึงเฉพาะที่รออนุมัติ
        const pendingBookings = await bookingService.getByStatus('pending');
        console.log('Pending bookings:', pendingBookings);

        // สร้างการจองใหม่
        const newBooking = await bookingService.create({
            storeName: 'ร้านใหม่',
            ownerName: 'นายใหม่',
            phone: '0898765432',
            email: 'new@example.com',
            shopType: 'clothing',
            stallNumber: 'B05',
            bookingDate: '2025-02-15',
        });
        console.log('Created:', newBooking);

        // อัพเดทสถานะ
        const updated = await bookingService.updateStatus(newBooking._id, 'approved');
        console.log('Updated:', updated);

        // ลบ
        await bookingService.delete(newBooking._id);
        console.log('Deleted successfully');

    } catch (error) {
        console.error('Error:', error);
    }
}

// ========================================
// ตัวอย่างที่ 7: Filter แบบต่างๆ
// ========================================
export function Example7_Filters() {
    return (
        <div>
            <h2>รายการรออนุมัติ</h2>
            <BookingList filterStatus="pending" />

            <h2>รายการอนุมัติแล้ว</h2>
            <BookingList filterStatus="approved" />

            <h2>ร้านอาหารเท่านั้น</h2>
            <BookingList filterShopType="food" />
        </div>
    );
}
