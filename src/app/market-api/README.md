# Market API Client

API Client Library สำหรับเรียกใช้ Market Booking API

## 🌐 API Base URL

```
https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings
```

## 📦 โครงสร้าง

```
market-api/
├── services/
│   └── bookingService.js      # ฟังก์ชันเรียก API
├── hooks/
│   └── useBookings.js         # React hooks
├── types/
│   └── booking.js             # Type definitions
├── components/
│   ├── BookingList.jsx        # แสดงรายการจอง
│   ├── BookingForm.jsx        # ฟอร์มสร้างการจอง
│   └── BookingCard.jsx        # การ์ดแสดงข้อมูลจอง
└── README.md
```

## 🚀 วิธีใช้งาน

### 1. Import Service

```javascript
import { bookingService } from '@/market-api/services/bookingService';

// ดึงข้อมูลทั้งหมด
const bookings = await bookingService.getAll();

// สร้างการจองใหม่
const newBooking = await bookingService.create({
  storeName: "ร้านกาแฟ",
  ownerName: "สมชาย",
  phone: "0812345678",
  email: "test@example.com",
  shopType: "food",
  stallNumber: "A01",
  bookingDate: "2025-01-15"
});
```

### 2. ใช้ React Hooks

```javascript
import { useBookings } from '@/market-api/hooks/useBookings';

function MyComponent() {
  const { bookings, loading, error, createBooking, updateBooking, deleteBooking } = useBookings();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {bookings.map(booking => (
        <div key={booking._id}>{booking.storeName}</div>
      ))}
    </div>
  );
}
```

### 3. ใช้ Components

```javascript
import BookingList from '@/market-api/components/BookingList';
import BookingForm from '@/market-api/components/BookingForm';

function Page() {
  return (
    <div>
      <BookingForm />
      <BookingList />
    </div>
  );
}
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | ดึงข้อมูลทั้งหมด |
| POST | `/api/bookings` | สร้างการจองใหม่ |
| GET | `/api/bookings/:id` | ดึงข้อมูลตาม ID |
| PUT | `/api/bookings/:id` | อัพเดทสถานะ |
| DELETE | `/api/bookings/:id` | ลบการจอง |

## 📝 Booking Schema

```javascript
{
  _id: "string",
  storeName: "string",
  ownerName: "string",
  phone: "string (10 digits)",
  email: "string",
  shopType: "food | clothing | goods | other",
  stallNumber: "string",
  bookingDate: "Date",
  status: "pending | approved | rejected",
  notes: "string (optional)",
  createdAt: "Date",
  updatedAt: "Date"
}
```
