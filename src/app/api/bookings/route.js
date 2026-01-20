/**
 * Bookings API Route
 * GET /api/bookings - Get all bookings
 */

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Mock bookings data
        const bookings = [
            {
                id: 1,
                shopName: 'ร้านคำแพก้า',
                owner: 'สมชาย โชค',
                phone: '0812345678',
                type: 'food',
                status: 'pending',
                statusColor: '#f39c12',
                createdAt: '2026-01-15'
            },
            {
                id: 2,
                shopName: 'ร้านแอ่มร้อ Modern',
                owner: 'สรัย สรนโร',
                phone: '0896765432',
                type: 'clothing',
                status: 'approved',
                statusColor: '#27ae60',
                createdAt: '2026-01-14'
            },
            {
                id: 3,
                shopName: 'ร้านขมเมาราง Golden',
                owner: 'คำ รศสราง',
                phone: '0867543210',
                type: 'food',
                status: 'rejected',
                statusColor: '#e74c3c',
                createdAt: '2026-01-13'
            }
        ];

        return NextResponse.json({
            success: true,
            data: bookings,
            message: 'Bookings retrieved successfully'
        });

    } catch (error) {
        console.error('Bookings error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
