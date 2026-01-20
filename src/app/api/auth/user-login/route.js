/**
 * User Login API Route
 * POST /api/auth/user-login
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        await dbConnect();
        
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
                { status: 400 }
            );
        }

        console.log('🔐 User login attempt:', { email });

        // Find user in MongoDB
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            console.error('❌ User not found:', email);
            return NextResponse.json(
                { success: false, error: 'ไม่พบบัญชีผู้ใช้นี้' },
                { status: 401 }
            );
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            console.error('❌ Invalid password for:', email);
            return NextResponse.json(
                { success: false, error: 'รหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        console.log('✅ User login successful:', { email });

        const userResponse = user.toJSON();

        return NextResponse.json({
            success: true,
            user: userResponse,
            token: token,
        });

    } catch (error) {
        console.error('❌ User login error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
