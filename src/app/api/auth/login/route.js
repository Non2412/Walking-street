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

        // External API Configuration
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app/api';

        console.log('🚀 Proxying Login to External API:', `${API_BASE_URL}/auth/user-login`);

        const response = await fetch(`${API_BASE_URL}/auth/user-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const responseText = await response.text();
        let data;

        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ External API Non-JSON Response:', responseText);
            const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
            const errorMessage = titleMatch ? titleMatch[1] : responseText.substring(0, 100);

            return NextResponse.json(
                { success: false, error: `External API Error: ${errorMessage}` },
                { status: response.status === 200 ? 502 : response.status }
            );
        }

        if (!response.ok) {
            console.error('❌ External API Login Error:', data);
            return NextResponse.json(
                { success: false, error: data.error || 'Login failed from External API' },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Login Proxy error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ภายนอก' },
            { status: 500 }
        );
    }
}
