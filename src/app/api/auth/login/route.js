import { NextResponse } from 'next/server';
import { findUserByEmail, DEFAULT_USERS } from '@/lib/mockDb';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

        const safeEmail = email.trim();

        console.log('🔍 Login attempt:', { email: safeEmail });

        // ---------------------------------------------------------
        // USE MONGODB IF AVAILABLE
        // ---------------------------------------------------------
        if (process.env.MONGODB_URI) {
            try {
                await dbConnect();

                // Find user
                const user = await User.findOne({ email: safeEmail.toLowerCase() });

                // Check Admin fallback if MONGODB is empty but we need admin access
                if (!user && safeEmail === 'admin@example.com' && password === '123456') {
                    return NextResponse.json({
                        success: true,
                        data: {
                            user: {
                                id: 'admin-fallback',
                                email: 'admin@example.com',
                                name: 'Admin Fallback',
                                role: 'admin'
                            },
                            token: 'admin-token-fallback',
                        },
                        message: 'เข้าสู่ระบบสำเร็จ (Admin Fallback)',
                    });
                }

                if (!user) {
                    return NextResponse.json(
                        { success: false, error: 'ไม่พบผู้ใช้งานนี้' },
                        { status: 404 }
                    );
                }

                // Verify password (Simple string comparison for now as per registration)
                // In production, use bcrypt.compare(password, user.password)
                if (user.password !== password) {
                    return NextResponse.json(
                        { success: false, error: 'รหัสผ่านไม่ถูกต้อง' },
                        { status: 401 }
                    );
                }

                console.log('✅ Login successful (DB):', user.email);

                const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');

                return NextResponse.json({
                    success: true,
                    data: {
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            shopName: user.shopName
                        },
                        token: token,
                    },
                    message: 'เข้าสู่ระบบสำเร็จ',
                });

            } catch (dbError) {
                console.error('Database Login Error:', dbError);
                return NextResponse.json(
                    { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล' },
                    { status: 500 }
                );
            }
        }

        // ---------------------------------------------------------
        // FALLBACK TO FILE SYSTEM (LOCAL ONLY)
        // ---------------------------------------------------------

        // ค้นหา user
        const user = findUserByEmail(safeEmail);

        console.log('👤 Found user:', user ? 'Yes' : 'No');

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
            message: 'เข้าสู่ระบบสำเร็จ (Local)',
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
