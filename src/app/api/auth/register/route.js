import { NextResponse } from 'next/server';
import { findUserByEmail, addUser, getAllUsers } from '@/lib/mockDb';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

        const safeEmail = email.trim().toLowerCase();

        // ---------------------------------------------------------
        // USE MONGODB IF AVAILABLE
        // ---------------------------------------------------------
        if (process.env.MONGODB_URI) {
            try {
                await dbConnect();

                // Check duplicate email
                const existingUser = await User.findOne({ email: safeEmail });
                if (existingUser) {
                    return NextResponse.json(
                        { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' },
                        { status: 409 }
                    );
                }

                // Create new user
                const newUser = await User.create({
                    name,
                    shopName,
                    shopDescription,
                    phone,
                    email: safeEmail,
                    password, // Note: In production, hash this password!
                    role: 'user'
                });

                // Create token (Mock token for now)
                const token = Buffer.from(`${newUser._id}:${Date.now()}`).toString('base64');

                return NextResponse.json({
                    success: true,
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role
                    },
                    token: token,
                    message: 'สมัครสมาชิกสำเร็จ (Database)',
                }, { status: 201 });

            } catch (dbError) {
                console.error('Database Error:', dbError);
                return NextResponse.json(
                    { success: false, error: `Database Connection Failed: ${dbError.message}` },
                    { status: 500 }
                );
            }
        }

        // ---------------------------------------------------------
        // FALLBACK TO FILE SYSTEM (LOCAL ONLY)
        // ---------------------------------------------------------

        // ตรวจสอบว่าอีเมลซ้ำหรือไม่
        const existingUser = findUserByEmail(safeEmail);
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
            email: safeEmail,
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
            message: 'สมัครสมาชิกสำเร็จ (Local)',
        }, { status: 201 });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
