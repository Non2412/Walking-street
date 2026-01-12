'use client';

import { useState, useEffect } from 'react';

// Mock data
const mockBookings = [
  {
    _id: '1',
    storeName: 'ร้านกาแฟเก่า',
    ownerName: 'สมชาย ใจดี',
    phone: '0812345678',
    email: 'somchai@example.com',
    shopType: 'food',
    stallNumber: 'A01',
    bookingDate: '2025-01-15',
    status: 'pending',
    createdAt: '2025-01-09T10:30:00Z',
    receiptImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="white" width="300" height="400"/%3E%3Ctext x="150" y="50" text-anchor="middle" font-size="20" font-weight="bold"%3Eสลิปการโอนเงิน%3C/text%3E%3Ctext x="20" y="100" font-size="14"%3Eจากบัญชี: 1234567890%3C/text%3E%3Ctext x="20" y="130" font-size="14"%3Eไปยังบัญชี: 0987654321%3C/text%3E%3Ctext x="20" y="160" font-size="14"%3Eจำนวนเงิน: 5,000 บาท%3C/text%3E%3Ctext x="20" y="190" font-size="14"%3Eวันเวลา: 2025-01-09 10:30%3C/text%3E%3Ctext x="20" y="220" font-size="14"%3Eรหัสอ้างอิง: TRN123456%3C/text%3E%3C/svg%3E'
  },
  {
    _id: '2',
    storeName: 'ร้านเสื้อผ้า Modern',
    ownerName: 'ส่วย สวยใจ',
    phone: '0898765432',
    email: 'suay@example.com',
    shopType: 'clothing',
    stallNumber: 'B02',
    bookingDate: '2025-01-16',
    status: 'approved',
    createdAt: '2025-01-08T14:20:00Z',
    receiptImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="white" width="300" height="400"/%3E%3Ctext x="150" y="50" text-anchor="middle" font-size="20" font-weight="bold"%3Eสลิปการโอนเงิน%3C/text%3E%3Ctext x="20" y="100" font-size="14"%3Eจากบัญชี: 9876543210%3C/text%3E%3Ctext x="20" y="130" font-size="14"%3Eไปยังบัญชี: 0987654321%3C/text%3E%3Ctext x="20" y="160" font-size="14"%3Eจำนวนเงิน: 5,500 บาท%3C/text%3E%3Ctext x="20" y="190" font-size="14"%3Eวันเวลา: 2025-01-08 14:20%3C/text%3E%3Ctext x="20" y="220" font-size="14"%3Eรหัสอ้างอิง: TRN123457%3C/text%3E%3C/svg%3E'
  },
  {
    _id: '3',
    storeName: 'ร้านขนมหวาน Golden',
    ownerName: 'ดำ รสหวาน',
    phone: '0867543210',
    email: 'dam@example.com',
    shopType: 'food',
    stallNumber: 'C03',
    bookingDate: '2025-01-17',
    status: 'rejected',
    createdAt: '2025-01-07T11:45:00Z',
    receiptImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="white" width="300" height="400"/%3E%3Ctext x="150" y="50" text-anchor="middle" font-size="20" font-weight="bold"%3Eสลิปการโอนเงิน%3C/text%3E%3Ctext x="20" y="100" font-size="14"%3Eจากบัญชี: 5555555555%3C/text%3E%3Ctext x="20" y="130" font-size="14"%3Eไปยังบัญชี: 0987654321%3C/text%3E%3Ctext x="20" y="160" font-size="14"%3Eจำนวนเงิน: 5,200 บาท%3C/text%3E%3Ctext x="20" y="190" font-size="14"%3Eวันเวลา: 2025-01-07 11:45%3C/text%3E%3Ctext x="20" y="220" font-size="14"%3Eรหัสอ้างอิง: TRN123458%3C/text%3E%3C/svg%3E'
  },
  {
    _id: '4',
    storeName: 'ร้านเครื่องใช้บ้าน',
    ownerName: 'เขียว สดใจ',
    phone: '0912345678',
    email: 'khiao@example.com',
    shopType: 'goods',
    stallNumber: 'D04',
    bookingDate: '2025-01-18',
    status: 'pending',
    createdAt: '2025-01-06T16:30:00Z',
    receiptImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="white" width="300" height="400"/%3E%3Ctext x="150" y="50" text-anchor="middle" font-size="20" font-weight="bold"%3Eสลิปการโอนเงิน%3C/text%3E%3Ctext x="20" y="100" font-size="14"%3Eจากบัญชี: 7777777777%3C/text%3E%3Ctext x="20" y="130" font-size="14"%3Eไปยังบัญชี: 0987654321%3C/text%3E%3Ctext x="20" y="160" font-size="14"%3Eจำนวนเงิน: 5,000 บาท%3C/text%3E%3Ctext x="20" y="190" font-size="14"%3Eวันเวลา: 2025-01-06 16:30%3C/text%3E%3Ctext x="20" y="220" font-size="14"%3Eรหัสอ้างอิง: TRN123459%3C/text%3E%3C/svg%3E'
  }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [bookings, setBookings] = useState(mockBookings);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleLogin = () => {
    if (token.trim()) {
      setIsAuthenticated(true);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setBookings(bookings.map(b => 
      b._id === id ? { ...b, status: newStatus as any } : b
    ));
  };

  const handleDelete = (id: string) => {
    setBookings(bookings.filter(b => b._id !== id));
  };

  const filtered = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>แดชบอร์ดแอดมิน</h1>
          <p style={{ textAlign: 'center', color: '#666', margin: '0 0 20px 0' }}>
            กรุณากรอกโทเค็นแอดมิน
          </p>
          <input
            type="password"
            placeholder="กรอกโทเค็น"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>🏪 แดชบอร์ดแอดมิน</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>จัดการการจองสถานค้า Walking Street</p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={{
            padding: '10px 24px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'all 0.3s'
          }}
        >
          🚪 ออกจากระบบ
        </button>
      </header>

      <div style={{ padding: '30px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          {[
            { label: 'การจองทั้งหมด', value: stats.total, color: '#667eea', icon: '📊' },
            { label: 'รอการอนุมัติ', value: stats.pending, color: '#ff9800', icon: '⏳' },
            { label: 'อนุมัติแล้ว', value: stats.approved, color: '#4caf50', icon: '✅' },
            { label: 'ปฏิเสธแล้ว', value: stats.rejected, color: '#f44336', icon: '❌' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: `3px solid ${stat.color}`,
              transition: 'all 0.3s',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.15)`;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: stat.color, marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <span style={{ fontSize: '20px' }}>🔍</span>
                <strong style={{ color: '#333', fontSize: '16px', fontWeight: '700' }}>ตัวกรอง</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    style={{
                      padding: '10px 20px',
                      background: filter === f ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e8eef7',
                      color: filter === f ? 'white' : '#667eea',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      boxShadow: filter === f ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                    }}
                  >
                    {f === 'all' && 'ทั้งหมด'}
                    {f === 'pending' && 'รอการอนุมัติ'}
                    {f === 'approved' && 'อนุมัติแล้ว'}
                    {f === 'rejected' && 'ปฏิเสธแล้ว'}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => window.open('/history', '_blank')}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #5e35b1 0%, #6c63ff 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(86, 35, 177, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              📜 ประวัติ
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '15px' }}>ชื่อร้าน</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '15px' }}>เจ้าของ</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '15px' }}>โทรศัพท์</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '15px' }}>ประเภท</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '15px' }}>สถานะ</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', fontSize: '15px' }}>การทำงาน</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking, idx) => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid #e8eef7', background: idx % 2 === 0 ? '#fff' : '#f8f9fb', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff3ff';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f8f9fb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <td style={{ padding: '16px', color: '#333', fontWeight: '600', fontSize: '15px' }}>{booking.storeName}</td>
                    <td style={{ padding: '16px', color: '#555' }}>{booking.ownerName}</td>
                    <td style={{ padding: '16px', color: '#555' }}>{booking.phone}</td>
                    <td style={{ padding: '16px', color: '#666', fontSize: '13px' }}>{booking.shopType}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        background:
                          booking.status === 'pending' ? '#fff3cd' :
                          booking.status === 'approved' ? '#d4edda' :
                          '#f8d7da',
                        color:
                          booking.status === 'pending' ? '#856404' :
                          booking.status === 'approved' ? '#155724' :
                          '#721c24'
                      }}>
                        {booking.status === 'pending' && '⏳ รอการอนุมัติ'}
                        {booking.status === 'approved' && '✅ อนุมัติแล้ว'}
                        {booking.status === 'rejected' && '❌ ปฏิเสธแล้ว'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          style={{
                            padding: '6px 12px',
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s',
                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
                          }}
                        >
                          👁️ ดู
                        </button>
                        {booking.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'approved')}
                            style={{
                              padding: '6px 12px',
                              background: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              transition: 'all 0.3s',
                              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                            }}
                          >
                            ✓ อนุมัติ
                          </button>
                        )}
                        {booking.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'rejected')}
                            style={{
                              padding: '6px 12px',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              transition: 'all 0.3s',
                              boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)'
                            }}
                          >
                            ✕ ปฏิเสธ
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking._id)}
                          style={{
                            padding: '6px 12px',
                            background: '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s',
                            boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
                          }}
                        >
                          🗑️ ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal รายละเอียด */}
      {selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, color: '#333', fontSize: '24px', fontWeight: '700' }}>รายละเอียดการจอง</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                ×
              </button>
            </div>

            {/* ข้อมูลการจอง */}
            <div style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', padding: '25px', borderRadius: '12px', border: '2px solid #667eea30' }}>
              <h3 style={{ marginTop: 0, color: '#333', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>📋 ข้อมูลการจอง</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ชื่อร้าน</div>
                  <div style={{ color: '#333', fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>{selectedBooking.storeName}</div>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>เจ้าของ</div>
                  <div style={{ color: '#333', fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>{selectedBooking.ownerName}</div>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>โทรศัพท์</div>
                  <div style={{ color: '#333', fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>{selectedBooking.phone}</div>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>อีเมล</div>
                  <div style={{ color: '#333', fontSize: '14px', fontWeight: '700', marginTop: '5px', wordBreak: 'break-all' }}>{selectedBooking.email}</div>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ประเภท</div>
                  <div style={{ color: '#333', fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>{selectedBooking.shopType}</div>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>หมายเลขสถาน</div>
                  <div style={{ color: '#333', fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>{selectedBooking.stallNumber}</div>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>วันที่จอง</div>
                  <div style={{ color: '#333', fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>{new Date(selectedBooking.bookingDate).toLocaleDateString('th-TH')}</div>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>สถานะ</div>
                  <span style={{
                    marginTop: '8px',
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    background:
                      selectedBooking.status === 'pending' ? '#fff3cd' :
                      selectedBooking.status === 'approved' ? '#d4edda' :
                      '#f8d7da',
                    color:
                      selectedBooking.status === 'pending' ? '#856404' :
                      selectedBooking.status === 'approved' ? '#155724' :
                      '#721c24'
                  }}>
                    {selectedBooking.status === 'pending' && '⏳ รอการอนุมัติ'}
                    {selectedBooking.status === 'approved' && '✅ อนุมัติแล้ว'}
                    {selectedBooking.status === 'rejected' && '❌ ปฏิเสธแล้ว'}
                  </span>
                </div>
              </div>
            </div>

            {/* สลิปการโอนเงิน */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#333', fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>🧾 สลิปการโอนเงิน</h3>
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '2px solid #e0e0e0', textAlign: 'center' }}>
                <img 
                  src={selectedBooking.receiptImage} 
                  alt="สลิปการโอนเงิน"
                  style={{
                    width: '100%',
                    maxHeight: '450px',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              </div>
            </div>

            {/* ปุ่มการทำงาน */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '2px solid #eee' }}>
              {selectedBooking.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedBooking._id, 'approved');
                    setSelectedBooking(null);
                  }}
                  style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  ✓ อนุมัติ
                </button>
              )}
              {selectedBooking.status !== 'rejected' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedBooking._id, 'rejected');
                    setSelectedBooking(null);
                  }}
                  style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #f44336 0%, #da190b 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                  }}
                >
                  ✕ ปฏิเสธ
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                style={{
                  padding: '12px 28px',
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  transition: 'all 0.3s'
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
