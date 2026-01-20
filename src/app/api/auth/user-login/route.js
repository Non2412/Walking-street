/**
 * User Login API Route
 * POST /api/auth/user-login
 * Proxies to market-api to avoid CORS issues
 */

import { NextResponse } from 'next/server';

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

        console.log('🔐 User login attempt:', { email });

        // Proxy to market-api
        const response = await fetch('https://market-api-mu.vercel.app/api/auth/user-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Market API error:', data);
            return NextResponse.json(
                { success: false, error: data.error || 'เข้าสู่ระบบไม่สำเร็จ' },
                { status: response.status }
            );
        }

        console.log('✅ User login successful:', data);

        return NextResponse.json({
            success: true,
            data: data.data,
        });

    } catch (error) {
        console.error('❌ User login error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
