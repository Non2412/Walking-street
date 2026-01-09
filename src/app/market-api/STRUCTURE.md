# 📁 โครงสร้างโฟลเดอร์ Market API Client

```
market-api/
├── 📄 README.md                    # ภาพรวมโปรเจค
├── 📄 QUICKSTART.md                # เริ่มต้นใช้งานเร็ว
├── 📄 USAGE.md                     # คู่มือการใช้งานแบบละเอียด
├── 📄 API_GUIDE.md                 # เอกสาร API จากเพื่อน
├── 📄 index.js                     # Export หลักของ library
├── 📄 examples.jsx                 # ตัวอย่างโค้ดทุกแบบ
│
├── 📂 services/                    # API Service Layer
│   └── bookingService.js           # ฟังก์ชันเรียก API ทั้งหมด
│
├── 📂 hooks/                       # React Hooks
│   └── useBookings.js              # Custom hooks สำหรับ bookings
│
├── 📂 types/                       # Type Definitions & Constants
│   └── booking.js                  # Types, constants, validators
│
├── 📂 components/                  # React Components
│   ├── BookingList.jsx             # แสดงรายการจอง
│   └── BookingForm.jsx             # ฟอร์มสร้างการจอง
│
└── 📂 app/                         # Next.js app (จากเพื่อน - ไม่ใช้)
    ├── api/
    ├── models/
    └── lib/
```

---

## 📦 ไฟล์ที่สำคัญ

### 🔧 Core Files (ใช้งานจริง)

| ไฟล์ | คำอธิบาย | ใช้เมื่อไหร่ |
|------|----------|-------------|
| `index.js` | Export หลัก | Import จากที่เดียว |
| `services/bookingService.js` | API calls | ต้องการควบคุมเต็มที่ |
| `hooks/useBookings.js` | React hooks | ใช้ใน Client Components |
| `types/booking.js` | Constants & validation | ต้องการ validate หรือใช้ constants |
| `components/BookingList.jsx` | แสดงรายการ | ต้องการ UI สำเร็จรูป |
| `components/BookingForm.jsx` | ฟอร์มสร้าง | ต้องการฟอร์มสำเร็จรูป |

### 📚 Documentation Files

| ไฟล์ | คำอธิบาย |
|------|----------|
| `README.md` | ภาพรวมและโครงสร้าง |
| `QUICKSTART.md` | เริ่มต้นใช้งานเร็ว |
| `USAGE.md` | คู่มือการใช้งานละเอียด |
| `API_GUIDE.md` | เอกสาร API จากเพื่อน |
| `examples.jsx` | ตัวอย่างโค้ดทุกแบบ |

### 🗑️ ไฟล์ที่ไม่ต้องใช้ (จาก API Server เดิม)

- `app/` - Next.js app ของ API server
- `models/` - Mongoose models
- `lib/` - MongoDB connection
- `docker-compose.yml` - Docker config
- `Dockerfile` - Docker image
- `package.json` - Dependencies ของ API server

**คุณสามารถลบไฟล์เหล่านี้ได้ถ้าต้องการ** เพราะตอนนี้เราใช้ API ที่ deploy แล้วบน Vercel

---

## 🚀 วิธีใช้งาน

### 1. Import แบบง่าย

```javascript
import { BookingList, BookingForm } from '@/market-api';
```

### 2. Import แบบเลือกเอา

```javascript
import { 
  bookingService,
  useBookings,
  BOOKING_STATUS 
} from '@/market-api';
```

### 3. Import แบบเฉพาะเจาะจง

```javascript
import bookingService from '@/market-api/services/bookingService';
import { useBookings } from '@/market-api/hooks/useBookings';
import BookingList from '@/market-api/components/BookingList';
```

---

## 🎯 เลือกใช้แบบไหนดี?

### ใช้ Components ถ้า:
- ✅ ต้องการ UI สำเร็จรูป
- ✅ ไม่ต้องการ customize มาก
- ✅ ต้องการเริ่มใช้งานเร็ว

### ใช้ Hooks ถ้า:
- ✅ ต้องการสร้าง UI เอง
- ✅ ต้องการควบคุม state
- ✅ ใช้ใน Client Components

### ใช้ Service ถ้า:
- ✅ ต้องการควบคุมเต็มที่
- ✅ ใช้ใน Server Components
- ✅ ไม่ต้องการ React hooks

---

## 📝 Next Steps

1. อ่าน [QUICKSTART.md](./QUICKSTART.md) เพื่อเริ่มใช้งานเร็ว
2. ดู [examples.jsx](./examples.jsx) เพื่อดูตัวอย่างโค้ด
3. อ่าน [USAGE.md](./USAGE.md) เพื่อเรียนรู้การใช้งานแบบละเอียด

---

## 🧹 ทำความสะอาด (Optional)

ถ้าต้องการลบไฟล์ที่ไม่ใช้:

```bash
cd market-api

# ลบ API server files
rm -rf app models lib
rm docker-compose.yml Dockerfile
rm package.json package-lock.json
rm next.config.mjs jsconfig.json eslint.config.mjs postcss.config.mjs
rm -rf public .next node_modules

# เหลือแค่
# - services/
# - hooks/
# - types/
# - components/
# - *.md files
# - index.js
# - examples.jsx
```

---

**สร้างโดย:** Market API Client Generator  
**วันที่:** 2026-01-09  
**เวอร์ชัน:** 1.0.0
