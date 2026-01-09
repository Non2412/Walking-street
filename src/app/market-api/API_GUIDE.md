# Market API - Backend

API จองพื้นที่ตั้งร้านค้าในตลาด สร้างจาก Next.js, MongoDB และ Docker

## เริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น
- Docker และ Docker Compose
- Node.js 18+ (สำหรับ development)

### วิธีการรัน

#### ด้วย Docker Compose (ง่ายที่สุด)
```bash
docker-compose up
```

จากนั้นเปิด http://localhost:3000 ในเบราวเซอร์

#### ด้วย npm (local development)
```bash
npm install
npm run dev
```

## API Endpoints

### ดูการจองทั้งหมด
```bash
GET /api/bookings
```

### เพิ่มการจองใหม่
```bash
POST /api/bookings
Content-Type: application/json

{
  "storeName": "ร้านอาหารสวรรค์",
  "ownerName": "สมชาย",
  "phone": "0812345678",
  "email": "somchai@example.com",
  "shopType": "อาหาร",
  "stallNumber": "A-01",
  "bookingDate": "2026-02-01T00:00:00Z",
  "notes": "ร้านอาหารไทย"
}
```

### ดูการจองตามรหัส
```bash
GET /api/bookings/:id
```

### อัปเดตการจอง
```bash
PUT /api/bookings/:id
Content-Type: application/json

{
  "status": "approved"
}
```

### ลบการจอง
```bash
DELETE /api/bookings/:id
```

## MongoDB ใน Docker

MongoDB จะรันบน port 27017 ด้วย credentials:
- Username: root
- Password: example
- Database: market-api

## โครงสร้างไฟล์

```
├── app/
│   ├── api/
│   │   └── bookings/           # API endpoints
│   │       ├── route.js        # GET, POST
│   │       └── [id]/
│   │           └── route.js    # GET, PUT, DELETE
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── lib/
│   └── mongodb.js              # MongoDB connection
├── models/
│   └── Booking.js              # Booking schema
├── docker-compose.yml          # Docker services
├── Dockerfile                  # Next.js container
└── package.json
```

## การพัฒนาต่อ

- [ ] เพิ่ม validation ขั้นสูง
- [ ] เพิ่ม authentication
- [ ] เพิ่ม dashboard UI
- [ ] เพิ่ม email notification
- [ ] เพิ่ม payment integration
