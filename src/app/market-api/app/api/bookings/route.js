import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request) {
  await dbConnect();

  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return Response.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();

    // ตรวจสอบค่าว่างต้องครบหรือไม่
    const requiredFields = ['storeName', 'ownerName', 'phone', 'email', 'shopType', 'stallNumber', 'bookingDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { success: false, error: `กรุณากรอก ${field}` },
          { status: 400 }
        );
      }
    }

    const booking = await Booking.create(body);

    return Response.json(
      { success: true, data: booking },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
