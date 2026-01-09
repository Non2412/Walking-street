# 🚀 Quick Start Guide

## ⚡ เริ่มใช้งานใน 3 นาที

### 1️⃣ Import สิ่งที่ต้องการ

```javascript
import { BookingList, BookingForm } from '@/market-api';
```

### 2️⃣ ใช้งานใน Component

```javascript
'use client';

import { BookingList, BookingForm } from '@/market-api';

export default function MyPage() {
  return (
    <div>
      <h1>ระบบจองพื้นที่ตลาด</h1>
      <BookingForm />
      <BookingList />
    </div>
  );
}
```

### 3️⃣ เสร็จแล้ว! 🎉

---

## 📖 ตัวอย่างการใช้งานแบบต่างๆ

### แบบที่ 1: ใช้ Components สำเร็จรูป (ง่ายที่สุด)

```javascript
'use client';

import { BookingList, BookingForm } from '@/market-api';

export default function Page() {
  return (
    <div>
      <BookingForm />
      <BookingList />
    </div>
  );
}
```

### แบบที่ 2: ใช้ React Hooks (ยืดหยุ่น)

```javascript
'use client';

import { useBookings } from '@/market-api';

export default function Page() {
  const { bookings, loading, createBooking, deleteBooking } = useBookings();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => createBooking({...})}>
        สร้างการจอง
      </button>
      
      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.storeName}</h3>
          <button onClick={() => deleteBooking(booking._id)}>
            ลบ
          </button>
        </div>
      ))}
    </div>
  );
}
```

### แบบที่ 3: ใช้ Service โดยตรง (ควบคุมเต็มที่)

```javascript
import { bookingService } from '@/market-api';

export default async function Page() {
  const bookings = await bookingService.getAll();

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking._id}>{booking.storeName}</div>
      ))}
    </div>
  );
}
```

---

## 🎯 Use Cases

### Dashboard Admin

```javascript
'use client';

import { useBookings, BookingList } from '@/market-api';

export default function AdminDashboard() {
  const { bookings } = useBookings();
  
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>ทั้งหมด: {stats.total} | รออนุมัติ: {stats.pending}</p>
      <BookingList filterStatus="pending" />
    </div>
  );
}
```

### หน้าสร้างการจอง

```javascript
'use client';

import { BookingForm } from '@/market-api';
import { useRouter } from 'next/navigation';

export default function CreateBookingPage() {
  const router = useRouter();

  return (
    <div>
      <h1>สร้างการจองใหม่</h1>
      <BookingForm 
        onSuccess={() => {
          alert('สร้างสำเร็จ!');
          router.push('/bookings');
        }}
      />
    </div>
  );
}
```

### หน้าแสดงรายการตามสถานะ

```javascript
'use client';

import { BookingList } from '@/market-api';

export default function PendingBookingsPage() {
  return (
    <div>
      <h1>รายการรออนุมัติ</h1>
      <BookingList filterStatus="pending" />
    </div>
  );
}
```

---

## 📦 สิ่งที่มีให้ใช้

### Components
- `<BookingList />` - แสดงรายการจอง
- `<BookingForm />` - ฟอร์มสร้างการจอง

### Hooks
- `useBookings()` - จัดการข้อมูลทั้งหมด
- `useBooking(id)` - ดึงข้อมูลเดียว
- `useBookingsByStatus(status)` - ฟิลเตอร์ตามสถานะ
- `useBookingsByShopType(type)` - ฟิลเตอร์ตามประเภท

### Services
- `bookingService.getAll()` - ดึงทั้งหมด
- `bookingService.getById(id)` - ดึงตาม ID
- `bookingService.create(data)` - สร้างใหม่
- `bookingService.updateStatus(id, status)` - อัพเดท
- `bookingService.delete(id)` - ลบ

### Constants
- `SHOP_TYPES` - ประเภทร้าน
- `BOOKING_STATUS` - สถานะการจอง
- `validateBookingData()` - Validate ข้อมูล

---

## 🔗 เอกสารเพิ่มเติม

- [USAGE.md](./USAGE.md) - คู่มือการใช้งานแบบละเอียด
- [examples.jsx](./examples.jsx) - ตัวอย่างโค้ดครบทุกแบบ
- [README.md](./README.md) - ข้อมูลโครงสร้าง API

---

## ❓ คำถามที่พบบ่อย

**Q: ต้องติดตั้งอะไรเพิ่มไหม?**  
A: ไม่ต้อง! ใช้งานได้เลย

**Q: ใช้กับ Next.js App Router ได้ไหม?**  
A: ได้ครับ! รองรับทั้ง Client และ Server Components

**Q: แก้ไข API URL ได้ไหม?**  
A: ได้ครับ แก้ที่ `services/bookingService.js`

**Q: มี TypeScript ไหม?**  
A: ยังไม่มีครับ แต่มี JSDoc comments ให้ autocomplete

---

**Happy Coding! 🎉**
