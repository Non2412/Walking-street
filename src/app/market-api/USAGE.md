# วิธีใช้งาน Market API Client

## 📚 สารบัญ
1. [เริ่มต้นใช้งาน](#เริ่มต้นใช้งาน)
2. [ใช้งาน Services](#ใช้งาน-services)
3. [ใช้งาน React Hooks](#ใช้งาน-react-hooks)
4. [ใช้งาน Components](#ใช้งาน-components)
5. [ตัวอย่างโค้ด](#ตัวอย่างโค้ด)

---

## เริ่มต้นใช้งาน

### 1. Import ที่จำเป็น

```javascript
// Import Service
import bookingService from '@/market-api/services/bookingService';

// Import Hooks
import { useBookings, useBooking } from '@/market-api/hooks/useBookings';

// Import Components
import BookingList from '@/market-api/components/BookingList';
import BookingForm from '@/market-api/components/BookingForm';

// Import Types & Constants
import { 
  SHOP_TYPES, 
  BOOKING_STATUS,
  validateBookingData 
} from '@/market-api/types/booking';
```

---

## ใช้งาน Services

### ดึงข้อมูลทั้งหมด
```javascript
const bookings = await bookingService.getAll();
console.log(bookings);
```

### ดึงข้อมูลตาม ID
```javascript
const booking = await bookingService.getById('booking_id_here');
console.log(booking);
```

### สร้างการจองใหม่
```javascript
const newBooking = await bookingService.create({
  storeName: "ร้านกาแฟ",
  ownerName: "สมชาย",
  phone: "0812345678",
  email: "somchai@example.com",
  shopType: "food",
  stallNumber: "A01",
  bookingDate: "2025-01-15",
  notes: "ขายกาแฟและขนม"
});
```

### อัพเดทสถานะ
```javascript
// อนุมัติ
await bookingService.updateStatus(bookingId, 'approved');

// ปฏิเสธ
await bookingService.updateStatus(bookingId, 'rejected');
```

### ลบการจอง
```javascript
await bookingService.delete(bookingId);
```

### ฟิลเตอร์ตามสถานะ
```javascript
const pendingBookings = await bookingService.getByStatus('pending');
const approvedBookings = await bookingService.getByStatus('approved');
```

### ฟิลเตอร์ตามประเภทร้าน
```javascript
const foodStores = await bookingService.getByShopType('food');
const clothingStores = await bookingService.getByShopType('clothing');
```

---

## ใช้งาน React Hooks

### useBookings - จัดการข้อมูลทั้งหมด

```javascript
function MyComponent() {
  const { 
    bookings,        // รายการจองทั้งหมด
    loading,         // สถานะกำลังโหลด
    error,           // ข้อความ error (ถ้ามี)
    createBooking,   // ฟังก์ชันสร้างการจอง
    updateBookingStatus, // ฟังก์ชันอัพเดทสถานะ
    deleteBooking,   // ฟังก์ชันลบ
    refresh          // ฟังก์ชัน refresh ข้อมูล
  } = useBookings();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking._id}>{booking.storeName}</div>
      ))}
    </div>
  );
}
```

### useBooking - ดึงข้อมูลเดียว

```javascript
function BookingDetail({ bookingId }) {
  const { booking, loading, error } = useBooking(bookingId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{booking.storeName}</h1>
      <p>เจ้าของ: {booking.ownerName}</p>
    </div>
  );
}
```

### useBookingsByStatus - ฟิลเตอร์ตามสถานะ

```javascript
function PendingBookings() {
  const { bookings, loading, error } = useBookingsByStatus('pending');

  return (
    <div>
      <h2>รายการรออนุมัติ ({bookings.length})</h2>
      {/* ... */}
    </div>
  );
}
```

---

## ใช้งาน Components

### BookingList - แสดงรายการจอง

```javascript
// แสดงทั้งหมด
<BookingList />

// แสดงเฉพาะที่รออนุมัติ
<BookingList filterStatus="pending" />

// แสดงเฉพาะร้านอาหาร
<BookingList filterShopType="food" />
```

### BookingForm - ฟอร์มสร้างการจอง

```javascript
function CreateBookingPage() {
  const handleSuccess = (newBooking) => {
    console.log('สร้างสำเร็จ:', newBooking);
    // ทำอะไรต่อ เช่น redirect
  };

  return <BookingForm onSuccess={handleSuccess} />;
}
```

---

## ตัวอย่างโค้ด

### ตัวอย่าง 1: Dashboard แบบง่าย

```javascript
'use client';

import BookingList from '@/market-api/components/BookingList';
import BookingForm from '@/market-api/components/BookingForm';

export default function DashboardPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard การจองพื้นที่</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <BookingForm />
      </div>
      
      <BookingList />
    </div>
  );
}
```

### ตัวอย่าง 2: Dashboard พร้อมสถิติ

```javascript
'use client';

import { useBookings } from '@/market-api/hooks/useBookings';
import BookingList from '@/market-api/components/BookingList';

export default function AdvancedDashboard() {
  const { bookings, loading } = useBookings();

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  return (
    <div>
      <h1>📊 Dashboard</h1>
      
      {/* สถิติ */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <StatCard title="ทั้งหมด" value={stats.total} />
        <StatCard title="รออนุมัติ" value={stats.pending} />
        <StatCard title="อนุมัติแล้ว" value={stats.approved} />
        <StatCard title="ปฏิเสธ" value={stats.rejected} />
      </div>

      <BookingList />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      flex: 1 
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}
```

### ตัวอย่าง 3: หน้าจัดการการจอง (Admin)

```javascript
'use client';

import { useState } from 'react';
import { useBookings } from '@/market-api/hooks/useBookings';
import BookingList from '@/market-api/components/BookingList';

export default function AdminPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div>
      <h1>🛠️ จัดการการจอง</h1>
      
      {/* ปุ่มกรอง */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setFilter('all')}>ทั้งหมด</button>
        <button onClick={() => setFilter('pending')}>รออนุมัติ</button>
        <button onClick={() => setFilter('approved')}>อนุมัติแล้ว</button>
        <button onClick={() => setFilter('rejected')}>ปฏิเสธ</button>
      </div>

      <BookingList 
        filterStatus={filter === 'all' ? null : filter} 
      />
    </div>
  );
}
```

### ตัวอย่าง 4: ใช้ Service ใน Server Component

```javascript
// app/bookings/page.js (Server Component)
import bookingService from '@/market-api/services/bookingService';

export default async function BookingsPage() {
  const bookings = await bookingService.getAll();

  return (
    <div>
      <h1>รายการจอง</h1>
      <ul>
        {bookings.map(booking => (
          <li key={booking._id}>
            {booking.storeName} - {booking.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### ตัวอย่าง 5: Form Validation

```javascript
import { validateBookingData } from '@/market-api/types/booking';

function MyForm() {
  const [formData, setFormData] = useState({...});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateBookingData(formData);
    
    if (!validation.isValid) {
      console.log('Errors:', validation.errors);
      return;
    }
    
    // ส่งข้อมูล
  };
}
```

---

## 🎨 Customization

### เปลี่ยน API URL

แก้ไขไฟล์ `services/bookingService.js`:

```javascript
const API_BASE_URL = 'YOUR_API_URL_HERE';
```

### Custom Styling

Components ทั้งหมดใช้ inline styles คุณสามารถแก้ไข styles object ในแต่ละ component ได้เลย

---

## 🔧 Troubleshooting

### CORS Error
ถ้าเจอ CORS error ให้ตรวจสอบว่า API server อนุญาต origin ของคุณ

### Network Error
ตรวจสอบว่า API URL ถูกต้องและ API server รันอยู่

### Data Not Updating
ลองใช้ `refresh()` function จาก `useBookings()` hook

---

## 📞 ติดต่อ

หากมีปัญหาหรือคำถาม สามารถสร้าง Issue ใน GitHub ได้เลยครับ
