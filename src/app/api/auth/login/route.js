
import { NextResponse } from 'next/server';

// TODO: เชื่อมกับ database จริง
// ตอนนี้ใช้ข้อมูลจำลอง
const MOCK_USERS = [
    {
        id: '1',
        email: 'admin@example.com',
        password: '123456', // ในระบบจริงต้อง hash ด้วย bcrypt
        name: 'Admin User',
        role: 'admin',
    },
    {
        id: '2',
        email: 'user@example.com',
        password: 'password',
        name: 'Regular User',
        role: 'user',
    },
];

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
                { status: 400 }
            );
        }

        // ค้นหา user
        const user = MOCK_USERS.find(u => u.email === email);

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบผู้ใช้งานนี้' },
                { status: 404 }
            );
        }

        // ตรวจสอบรหัสผ่าน
        // TODO: ใช้ bcrypt.compare() ในระบบจริง
        if (user.password !== password) {
            return NextResponse.json(
                { success: false, error: 'รหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // สร้าง token (ในระบบจริงใช้ JWT)
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        // ส่งข้อมูล user กลับ (ไม่ส่ง password)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPassword, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            token: token,
            message: 'เข้าสู่ระบบสำเร็จ',
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
