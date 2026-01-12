'use client';

import { useState } from 'react';

// Mock history data
const historyData = [
  { id: 1, action: 'อนุมัติการจอง', storeName: 'ร้านกาแฟเก่า', owner: 'สมชาย ใจดี', date: '2025-01-12 14:30', status: 'approved', admin: 'Admin1' },
  { id: 2, action: 'ปฏิเสธการจอง', storeName: 'ร้านขนมหวาน Golden', owner: 'ดำ รสหวาน', date: '2025-01-12 13:15', status: 'rejected', admin: 'Admin2' },
  { id: 3, action: 'ลบการจอง', storeName: 'ร้านเสื้อผ้า Modern', owner: 'ส่วย สวยใจ', date: '2025-01-12 12:00', status: 'deleted', admin: 'Admin1' },
  { id: 4, action: 'เพิ่มการจองใหม่', storeName: 'ร้านเครื่องใช้บ้าน', owner: 'เขียว สดใจ', date: '2025-01-12 11:20', status: 'created', admin: 'System' },
  { id: 5, action: 'อนุมัติการจอง', storeName: 'ร้านอาหารไทย', owner: 'สร้อย อร่อยมี', date: '2025-01-11 16:45', status: 'approved', admin: 'Admin3' },
  { id: 6, action: 'แก้ไขการจอง', storeName: 'ร้านกาแฟเก่า', owner: 'สมชาย ใจดี', date: '2025-01-11 15:30', status: 'edited', admin: 'Admin1' },
  { id: 7, action: 'ปฏิเสธการจอง', storeName: 'ร้านจิวเวลรี่', owner: 'แพร ตัวประกาศ', date: '2025-01-11 14:00', status: 'rejected', admin: 'Admin2' },
  { id: 8, action: 'อนุมัติการจอง', storeName: 'ร้านรองเท้า', owner: 'วิชา เดินดี', date: '2025-01-10 10:15', status: 'approved', admin: 'Admin1' },
];

const getActionColor = (status: string) => {
  switch(status) {
    case 'approved': return '#4caf50';
    case 'rejected': return '#f44336';
    case 'deleted': return '#ff9800';
    case 'created': return '#2196f3';
    case 'edited': return '#9c27b0';
    default: return '#666';
  }
};

const getActionIcon = (action: string) => {
  switch(action) {
    case 'อนุมัติการจอง': return '✅';
    case 'ปฏิเสธการจอง': return '❌';
    case 'ลบการจอง': return '🗑️';
    case 'เพิ่มการจองใหม่': return '➕';
    case 'แก้ไขการจอง': return '✏️';
    default: return '📝';
  }
};

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' 
    ? historyData 
    : historyData.filter(item => item.status === filter);

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
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>📜 ประวัติการจัดการ</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>บันทึกการอนุมัติและจัดการการจองทั้งหมด</p>
        </div>
        <button
          onClick={() => window.close()}
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
          ✕ ปิด
        </button>
      </header>

      <div style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Filter */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '25px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <strong style={{ color: '#333', fontSize: '15px', fontWeight: '700' }}>ตัวกรองตามการทำงาน</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['all', 'approved', 'rejected', 'deleted', 'created', 'edited'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  background: filter === f ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e8eef7',
                  color: filter === f ? 'white' : '#667eea',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  boxShadow: filter === f ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                }}
              >
                {f === 'all' && 'ทั้งหมด'}
                {f === 'approved' && '✅ อนุมัติ'}
                {f === 'rejected' && '❌ ปฏิเสธ'}
                {f === 'deleted' && '🗑️ ลบ'}
                {f === 'created' && '➕ สร้างใหม่'}
                {f === 'edited' && '✏️ แก้ไข'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline History */}
        <div style={{ position: 'relative' }}>
          {filtered.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '20px', position: 'relative' }}>
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: getActionColor(item.status),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: `0 4px 12px ${getActionColor(item.status)}40`,
                  flexShrink: 0
                }}>
                  {getActionIcon(item.action)}
                </div>
                {index < filtered.length - 1 && (
                  <div style={{
                    width: '3px',
                    height: '60px',
                    background: 'linear-gradient(180deg, #e0e0e0 0%, transparent 100%)',
                    marginTop: '10px'
                  }} />
                )}
              </div>

              {/* Content card */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '18px',
                flex: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: `2px solid ${getActionColor(item.status)}20`,
                transition: 'all 0.3s'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ color: '#999', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>การทำงาน</div>
                    <div style={{ color: '#333', fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>
                      {item.action}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#999', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>เวลา</div>
                    <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>
                      {item.date}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <div style={{ color: '#999', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ชื่อร้าน</div>
                    <div style={{ color: '#333', fontSize: '15px', fontWeight: '600', marginTop: '4px' }}>
                      {item.storeName}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#999', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>เจ้าของ</div>
                    <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>
                      {item.owner}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
                  <div style={{ color: '#999', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>โดย</div>
                  <div style={{ color: '#667eea', fontSize: '14px', fontWeight: '700', marginTop: '4px' }}>
                    {item.admin}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px 30px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
            <div style={{ color: '#999', fontSize: '16px', fontWeight: '600' }}>
              ไม่มีประวัติการทำงาน
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
