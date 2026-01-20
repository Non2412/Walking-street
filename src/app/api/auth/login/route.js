/**
 * Login API Route - Using Shared Database
 * POST /api/auth/login
 */

import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/mockDb';

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
        const user = findUserByEmail(email);

        console.log('🔍 Login attempt:', { email });
        console.log('👤 Found user:', user ? `Yes - ${user.email}` : 'No');

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบผู้ใช้งานนี้' },
                { status: 404 }
            );
        }

        // ตรวจสอบรหัสผ่าน
        if (user.password !== password) {
            return NextResponse.json(
                { success: false, error: 'รหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // สร้าง token
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        // ส่งข้อมูล user กลับ (ไม่ส่ง password)
        // eslint-disable-next-line no-unused-vars
        const { password: userPassword, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token: token,
            },
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
