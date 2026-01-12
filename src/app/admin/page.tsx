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
  }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [bookings, setBookings] = useState(mockBookings);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

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
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>แดชบอร์ดแอดมิน</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ออกจากระบบ
        </button>
      </header>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          {[
            { label: 'การจองทั้งหมด', value: stats.total, color: '#667eea' },
            { label: 'รอการอนุมัติ', value: stats.pending, color: '#ff9800' },
            { label: 'อนุมัติแล้ว', value: stats.approved, color: '#4caf50' },
            { label: 'ปฏิเสธแล้ว', value: stats.rejected, color: '#f44336' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: `3px solid ${stat.color}`
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#333', marginTop: '8px', fontWeight: 'bold' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ marginRight: '10px', color: '#333' }}>ตัวกรอง:</strong>
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                style={{
                  padding: '6px 14px',
                  marginRight: '8px',
                  background: filter === f ? '#667eea' : '#e0e0e0',
                  color: filter === f ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                {f === 'all' && 'ทั้งหมด'}
                {f === 'pending' && 'รอการอนุมัติ'}
                {f === 'approved' && 'อนุมัติแล้ว'}
                {f === 'rejected' && 'ปฏิเสธแล้ว'}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '6px', marginTop: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ชื่อร้าน</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>เจ้าของ</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>โทรศัพท์</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ประเภท</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>สถานะ</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>การทำงาน</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking, idx) => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                    <td style={{ padding: '12px', color: '#333', fontWeight: '500' }}>{booking.storeName}</td>
                    <td style={{ padding: '12px', color: '#555' }}>{booking.ownerName}</td>
                    <td style={{ padding: '12px', color: '#555' }}>{booking.phone}</td>
                    <td style={{ padding: '12px', color: '#555', fontSize: '13px' }}>{booking.shopType}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background:
                          booking.status === 'pending' ? '#fff3cd' :
                          booking.status === 'approved' ? '#d4edda' :
                          '#f8d7da',
                        color:
                          booking.status === 'pending' ? '#856404' :
                          booking.status === 'approved' ? '#155724' :
                          '#721c24'
                      }}>
                        {booking.status === 'pending' && 'รอการอนุมัติ'}
                        {booking.status === 'approved' && 'อนุมัติแล้ว'}
                        {booking.status === 'rejected' && 'ปฏิเสธแล้ว'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        {booking.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'approved')}
                            style={{
                              padding: '5px 10px',
                              background: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            ✓ อนุมัติ
                          </button>
                        )}
                        {booking.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'rejected')}
                            style={{
                              padding: '5px 10px',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            ✕ ปฏิเสธ
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking._id)}
                          style={{
                            padding: '5px 10px',
                            background: '#757575',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
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
    </div>
  );
}
