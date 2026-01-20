'use client';

import { useEffect, useState } from 'react';
import { useMarketAuth } from '@/contexts/MarketAuthContext';
import Navbar from '@/components/Navbar';

export default function HistoryPage() {
  const { token, user, loading: authLoading } = useMarketAuth();
  const [historyData, setHistoryData] = useState<Array<{
    id: any;
    action: string;
    storeName: string;
    owner: string;
    date: string;
    status: string;
    admin: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !token) {
      window.location.href = '/login';
    }
  }, [token, authLoading]);

  useEffect(() => {
    if (!token || authLoading) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bookings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch history');
        const result = await response.json();
        
        // Convert bookings to history format
        const history = (result.data || []).map((booking: any, idx: number) => ({
          id: booking._id || idx,
          action: booking.status === 'approved' ? 'อนุมัติการจอง' : 
                   booking.status === 'rejected' ? 'ปฏิเสธการจอง' : 'เพิ่มการจองใหม่',
          storeName: booking.storeName,
          owner: booking.ownerName,
          date: new Date(booking.createdAt).toLocaleString('th-TH'),
          status: booking.status,
          admin: user?.fullName || 'System',
        }));

        setHistoryData(history);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, authLoading, user]);

  const getActionColor = (status: string) => {
    switch(status) {
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'deleted': return '#ff9800';
      case 'pending': return '#2196f3';
      case 'created': return '#2196f3';
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

  const filtered = filter === 'all' 
    ? historyData 
    : historyData.filter(item => item.status === filter);

  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div style={{ fontFamily: 'Sarabun, Arial, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
        marginTop: '20px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>📜 ประวัติการจัดการ</h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>บันทึกการอนุมัติและจัดการการจองทั้งหมด</p>
        </div>
      </header>

      <div style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Filter Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '25px', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <strong style={{ color: '#333', fontSize: '15px', fontWeight: '700' }}>ตัวกรองตามสถานะ</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['all', 'approved', 'rejected', 'pending'].map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
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
                {f === 'all' && '📋 ทั้งหมด'}
                {f === 'approved' && '✅ อนุมัติแล้ว'}
                {f === 'rejected' && '❌ ปฏิเสธ'}
                {f === 'pending' && '⏳ รอการอนุมัติ'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px 30px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'spin 1s linear infinite' }}>⏳</div>
            <p style={{ color: '#666', fontSize: '16px' }}>กำลังโหลดประวัติการจัดการ...</p>
          </div>
        )}

        {/* Timeline History */}
        {!loading && (
          <>
            <div style={{ position: 'relative' }}>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '20px', position: 'relative' }}>
                    {/* Timeline Dot */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      width: '50px',
                      position: 'relative'
                    }}>
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
                        boxShadow: `0 4px 12px ${getActionColor(item.status)}60`,
                        flexShrink: 0,
                        zIndex: 2
                      }}>
                        {getActionIcon(item.action)}
                      </div>
                      {index < paginatedItems.length - 1 && (
                        <div style={{
                          width: '3px',
                          height: '60px',
                          background: 'linear-gradient(180deg, #e0e0e0 0%, #f0f0f0 100%)',
                          marginTop: '8px',
                          position: 'absolute',
                          top: '50px'
                        }} />
                      )}
                    </div>

                    {/* Content Card */}
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      flex: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: `2px solid ${getActionColor(item.status)}30`,
                      transition: 'all 0.3s',
                      marginTop: '5px'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ 
                            color: '#999', 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            marginBottom: '5px'
                          }}>
                            การทำงาน
                          </div>
                          <div style={{ color: '#333', fontSize: '15px', fontWeight: '700' }}>
                            {item.action}
                          </div>
                        </div>
                        <div>
                          <div style={{ 
                            color: '#999', 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            marginBottom: '5px'
                          }}>
                            วันที่และเวลา
                          </div>
                          <div style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>
                            {item.date}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '15px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f0f0f0'
                      }}>
                        <div>
                          <div style={{ 
                            color: '#999', 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            marginBottom: '5px'
                          }}>
                            ชื่อร้านค้า
                          </div>
                          <div style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>
                            {item.storeName}
                          </div>
                        </div>
                        <div>
                          <div style={{ 
                            color: '#999', 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            marginBottom: '5px'
                          }}>
                            เจ้าของร้าน
                          </div>
                          <div style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>
                            {item.owner}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
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

            {/* Pagination */}
            {filtered.length > itemsPerPage && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                marginTop: '30px',
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
              }}>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    background: currentPage === 1 ? '#e0e0e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: currentPage === 1 ? '#999' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  ← ก่อนหน้า
                </button>
                <span style={{ color: '#666', fontWeight: '600', minWidth: '80px', textAlign: 'center' }}>
                  หน้า {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    background: currentPage === totalPages ? '#e0e0e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: currentPage === totalPages ? '#999' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  ถัดไป →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
