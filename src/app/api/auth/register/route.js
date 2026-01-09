/**
 * Register API Route
 * POST /api/auth/register
 */

import { NextResponse } from 'next/server';

// TODO: เชื่อมกับ database จริง
// ตอนนี้เก็บใน memory (จะหายเมื่อ restart server)
let USERS = [
    {
        id: '1',
        email: 'admin@example.com',
        password: '123456',
        name: 'Admin User',
        role: 'admin',
    },
];

export async function POST(request) {
    try {
        const { name, email, password, confirmPassword } = await request.json();

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { success: false, error: 'รหัสผ่านไม่ตรงกัน' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                { status: 400 }
            );
        }

        // ตรวจสอบว่าอีเมลซ้ำหรือไม่
        const existingUser = USERS.find(u => u.email === email);
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 409 }
            );
        }

        // สร้าง user ใหม่
        const newUser = {
            id: String(USERS.length + 1),
            email,
            password, // TODO: hash ด้วย bcrypt ในระบบจริง
            name,
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        USERS.push(newUser);

        // สร้าง token
        const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

        // ส่งข้อมูล user กลับ (ไม่ส่ง password)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPassword, ...userWithoutPassword } = newUser;

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            token: token,
            message: 'สมัครสมาชิกสำเร็จ',
        }, { status: 201 });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
