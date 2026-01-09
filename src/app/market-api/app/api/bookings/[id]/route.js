import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return Response.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await request.json();

    const booking = await Booking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return Response.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return Response.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'ลบการจองสำเร็จ' },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
