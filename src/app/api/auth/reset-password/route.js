/**
 * Reset Password API Route
 * POST /api/auth/reset-password
 */

import { NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/emailService';
import crypto from 'crypto';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request
export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

// TODO: ในระบบจริงควรเก็บ reset tokens ใน database
// ตอนนี้เก็บใน memory (จะหายเมื่อ restart server)
const resetTokens = new Map();

export async function POST(request) {
    try {
        const { email } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { success: false, error: 'กรุณากรอกอีเมล' },
                { status: 400, headers: corsHeaders }
            );
        }

        // TODO: ตรวจสอบว่ามี email นี้ในระบบหรือไม่
        // const user = await User.findOne({ email });
        // if (!user) {
        //   return NextResponse.json(
        //     { success: false, error: 'ไม่พบอีเมลนี้ในระบบ' },
        //     { status: 404 }
        //   );
        // }

        // สร้าง reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // เก็บ token พร้อมเวลาหมดอายุ (1 ชั่วโมง)
        resetTokens.set(resetToken, {
            email,
            expiresAt: Date.now() + 3600000, // 1 hour
        });

        // ส่งอีเมล
        const emailResult = await sendPasswordResetEmail(email, resetToken);

        if (!emailResult.success) {
            return NextResponse.json(
                { success: false, error: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง' },
                { status: 500, headers: corsHeaders }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว',
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// ฟังก์ชันตรวจสอบ token (สำหรับหน้า reset password)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบ token' },
                { status: 400, headers: corsHeaders }
            );
        }

        const tokenData = resetTokens.get(token);

        if (!tokenData) {
            return NextResponse.json(
                { success: false, error: 'Token ไม่ถูกต้อง' },
                { status: 400, headers: corsHeaders }
            );
        }

        if (Date.now() > tokenData.expiresAt) {
            resetTokens.delete(token);
            return NextResponse.json(
                { success: false, error: 'Token หมดอายุแล้ว' },
                { status: 400, headers: corsHeaders }
            );
        }

        return NextResponse.json({
            success: true,
            email: tokenData.email,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Verify token error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500, headers: corsHeaders }
        );
    }
}
