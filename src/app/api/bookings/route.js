
import { NextResponse } from 'next/server';
import { getAllBookings, addBooking, updateBookingStatus, saveData, BOOKINGS_FILE } from '@/lib/mockDb';

// GET: ดึงข้อมูลการจองทั้งหมด
export async function GET() {
    try {
        const bookings = getAllBookings();
        return NextResponse.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST: สร้างการจองใหม่
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate basic fields
        if (!body.booths || !body.userId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newBooking = addBooking(body);
        return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT: อัปเดตสถานะ หรือ แนบสลิป
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, status, paymentSlip, price } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Logic ในการ update ข้อมูลเพิ่มเติม
        const bookings = getAllBookings();
        const idx = bookings.findIndex(b => b.id === id);

        if (idx !== -1) {
            // Update fields
            if (status) bookings[idx].status = status;
            if (paymentSlip) bookings[idx].paymentSlip = paymentSlip;
            if (price) bookings[idx].price = price;

            // Save updates
            saveData(BOOKINGS_FILE, bookings);

            return NextResponse.json({ success: true, data: bookings[idx] });
        } else {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
