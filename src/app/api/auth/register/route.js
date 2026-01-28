import { NextResponse } from 'next/server';

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

        // External API Configuration
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app/api';

        // Prepare Payload for External API
        const safeEmail = email.trim().toLowerCase();
        const username = safeEmail.split('@')[0];

        const payload = {
            username: username,
            email: safeEmail,
            password: password,
            fullName: name
        };

        console.log('🚀 Proxying Register to External API:', `${API_BASE_URL}/auth/signup`);

        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ External API Error:', data);
            return NextResponse.json(
                { success: false, error: data.error || 'Registration failed from External API' },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Register Proxy error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ภายนอก' },
            { status: 500 }
        );
    }
}
