/**
 * Admin Login API Route
 * POST /api/auth/login
 * Proxies to market-api to avoid CORS issues
 */

import { NextResponse } from 'next/server';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request
export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
                { status: 400, headers: corsHeaders }
            );
        }

        console.log('🔐 Admin login attempt:', { email });

        // Proxy to market-api
        const response = await fetch('https://market-api-mu.vercel.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Market API error:', data);
            return NextResponse.json(
                { success: false, error: data.error || 'เข้าสู่ระบบไม่สำเร็จ' },
                { status: response.status, headers: corsHeaders }
            );
        }

        console.log('✅ Admin login successful:', data);

        return NextResponse.json({
            success: true,
            data: data.data,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('❌ Admin login error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500, headers: corsHeaders }
        );
    }
}
