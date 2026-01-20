/**
 * Register API Route - Using MongoDB
 * POST /api/auth/signup
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
    try {
        await dbConnect();
        
        const { name, email, password, confirmPassword, fullName, username } = await request.json();

        console.log('📝 Register attempt:', { email, name });

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
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
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 409 }
            );
        }

        // สร้าง user ใหม่
        const newUser = new User({
            email: email.toLowerCase(),
            password,
            name: name || fullName || username,
            fullName: fullName || name,
            username: username || email.split('@')[0],
            role: 'user',
        });

        await newUser.save();
        console.log('✅ User registered:', { email });

        // ส่งข้อมูล user กลับ (ไม่ส่ง password)
        const userResponse = newUser.toJSON();

        return NextResponse.json({
            success: true,
            user: userResponse,
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
