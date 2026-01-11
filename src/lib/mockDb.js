/**
 * File-based Mock Database
 * เก็บข้อมูลใน JSON file แทน localStorage
 */

import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'users.json');

// Default users
const DEFAULT_USERS = [
    {
        id: '1',
        email: 'admin@example.com',
        password: '123456',
        name: 'Admin User',
        shopName: 'ร้านตัวอย่าง',
        shopDescription: 'ร้านค้าตัวอย่าง',
        phone: '0812345678',
        role: 'admin',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        email: 'user@example.com',
        password: '123456',
        name: 'Test User',
        shopName: 'ร้านทดสอบ',
        shopDescription: 'ร้านค้าทดสอบ',
        phone: '0823456789',
        role: 'user',
        createdAt: new Date().toISOString(),
    },
];

// สร้าง directory ถ้ายังไม่มี
function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

// โหลดข้อมูลจาก file
function loadFromFile() {
    ensureDataDir();

    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            const users = JSON.parse(data);
            console.log('📚 Loaded', users.length, 'users from file');
            return users;
        }
    } catch (error) {
        console.error('Error loading from file:', error);
    }

    // ถ้าไม่มีไฟล์ ใช้ default
    console.log('📝 Initializing with default users');
    saveToFile(DEFAULT_USERS);
    return DEFAULT_USERS;
}

// บันทึกลง file
function saveToFile(users) {
    ensureDataDir();

    try {
        const jsonData = JSON.stringify(users, null, 2);
        fs.writeFileSync(DB_FILE, jsonData, 'utf8');
        console.log('💾 Saved', users.length, 'users to file:', DB_FILE);
        console.log('📝 File content:', jsonData.substring(0, 100) + '...');

        // ตรวจสอบว่าเขียนสำเร็จ
        const verify = fs.readFileSync(DB_FILE, 'utf8');
        const verifyUsers = JSON.parse(verify);
        console.log('✅ Verified:', verifyUsers.length, 'users in file');
    } catch (error) {
        console.error('❌ Error saving to file:', error);
    }
}

// ค้นหา user ด้วย email
export function findUserByEmail(email) {
    const users = loadFromFile();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    console.log('🔎 Search:', email, '→', found ? `Found: ${found.email}` : 'Not found');
    return found;
}

// เพิ่ม user ใหม่
export function addUser(user) {
    const users = loadFromFile();

    // ตรวจสอบ email ซ้ำ
    const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) {
        throw new Error('Email already exists');
    }

    // เพิ่ม user
    const newUser = {
        ...user,
        id: String(users.length + 1),
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveToFile(users);

    console.log('➕ Added user:', newUser.email);
    return newUser;
}

// ดึงข้อมูล users ทั้งหมด
export function getAllUsers() {
    return loadFromFile();
}

// Reset database
export function resetDatabase() {
    saveToFile(DEFAULT_USERS);
    console.log('🔄 Database reset');
}
