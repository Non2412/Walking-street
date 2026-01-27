import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'กรุณาระบุอีเมล'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'กรุณาระบุรหัสผ่าน'],
    },
    name: {
        type: String,
        required: [true, 'กรุณาระบุชื่อ'],
    },
    shopName: {
        type: String,
        required: [true, 'กรุณาระบุชื่อร้าน'],
    },
    shopDescription: {
        type: String,
        required: [true, 'กรุณาระบุรายละเอียดร้าน'],
    },
    phone: {
        type: String,
        required: [true, 'กรุณาระบุเบอร์โทรศัพท์'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
