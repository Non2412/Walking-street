/**
 * Register API Route - Using Shared Database
 * POST /api/auth/register
 */

import { NextResponse } from 'next/server';
import { findUserByEmail, addUser, getAllUsers } from '@/lib/mockDb';

export async function POST(request) {
    try {
        const { name, shopName, shopDescription, phone, email, password, confirmPassword } = await request.json();

        // Validation
        if (!name || !shopName || !shopDescription || !phone || !email || !password || !confirmPassword) {
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
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 409 }
            );
        }

        // สร้าง user ใหม่
        const allUsers = getAllUsers();
        const newUser = {
            id: String(allUsers.length + 1),
            email: email.toLowerCase(),
            password,
            name,
            shopName,
            shopDescription,
            phone,
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        addUser(newUser);

        // สร้าง token
        const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

        // ส่งข้อมูล user กลับ (ไม่ส่ง password)
        // eslint-disable-next-line no-unused-vars
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
