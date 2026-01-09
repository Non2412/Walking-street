import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, 'โปรดระบุชื่อร้านค้า'],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, 'โปรดระบุชื่อเจ้าของ'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'โปรดระบุเบอร์โทรศัพท์'],
      match: [/^[0-9]{10}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง'],
    },
    email: {
      type: String,
      required: [true, 'โปรดระบุอีเมล'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'อีเมลไม่ถูกต้อง'],
    },
    shopType: {
      type: String,
      required: [true, 'โปรดเลือกประเภทร้านค้า'],
      enum: ['food', 'clothing', 'goods', 'other'],
    },
    stallNumber: {
      type: String,
      required: [true, 'โปรดระบุหมายเลขพื้นที่'],
      trim: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'โปรดระบุวันที่จอง'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
