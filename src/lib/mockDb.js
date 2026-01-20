/**
 * File-based Mock Database
 * เก็บข้อมูลใน JSON file แทน localStorage
 */

import fs from 'fs';
import path from 'path';

// DB Files - EXPORTED
export const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
export const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

// Default users
const DEFAULT_USERS = [
    {
        id: '1',
        email: 'admin@example.com',
        password: '123456',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        email: 'user@example.com',
        password: '123456',
        name: 'Test User',
        role: 'user',
        createdAt: new Date().toISOString(),
    },
];

// Helper to load data - EXPORTED
export function loadData(filePath, defaultData = []) {
    ensureDataDir();
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Error loading file ${filePath}:`, error);
    }
    // Initialize if missing
    saveData(filePath, defaultData);
    return defaultData;
}

// Helper to save data - EXPORTED
export function saveData(filePath, data) {
    ensureDataDir();
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error saving file ${filePath}:`, error);
    }
}

// --- Users ---

export function findUserByEmail(email) {
    // โหลด users ทั้งหมด
    const users = loadData(USERS_FILE, DEFAULT_USERS);

    // ค้นหา user
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // EMERGENCY FIX: ถ้าหา admin@example.com ไม่เจอ หรือ role ผิด
    if (email === 'admin@example.com') {
        const defaultAdmin = DEFAULT_USERS.find(u => u.email === 'admin@example.com');
        if (!user) {
            // ถ้าไม่มี admin ให้เพิ่มเข้าไป
            console.log('Admin not found in DB, restoring default admin...');
            users.push(defaultAdmin);
            saveData(USERS_FILE, users);
            return defaultAdmin;
        } else if (user.role !== 'admin') {
            // ถ้ามีแต่ role ผิด ให้แก้ role
            console.log('Admin role incorrect, fixing...');
            user.role = 'admin';
            saveData(USERS_FILE, users);
        }
    }

    return user;
}

export function addUser(user) {
    const users = loadData(USERS_FILE, DEFAULT_USERS);
    if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        throw new Error('Email already exists');
    }
    const newUser = { ...user, id: String(users.length + 1), createdAt: new Date().toISOString() };
    users.push(newUser);
    saveData(USERS_FILE, users);
    return newUser;
}

export function getAllUsers() {
    return loadData(USERS_FILE, DEFAULT_USERS);
}

// --- Bookings ---

export function getAllBookings() {
    return loadData(BOOKINGS_FILE, []);
}

export function addBooking(booking) {
    const bookings = loadData(BOOKINGS_FILE, []);
    const newBooking = {
        ...booking,
        id: Date.now().toString(), // Use timestamp as ID
        status: 'pending', // Default status
        createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    saveData(BOOKINGS_FILE, bookings);
    return newBooking;
}

export function updateBookingStatus(id, status) {
    const bookings = loadData(BOOKINGS_FILE, []);
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = status;
        bookings[index].updatedAt = new Date().toISOString();
        saveData(BOOKINGS_FILE, bookings);
        return bookings[index];
    }
    return null;
}

export function deleteBooking(id) {
    let bookings = loadData(BOOKINGS_FILE, []);
    const initialLength = bookings.length;
    bookings = bookings.filter(b => b.id !== id);
    if (bookings.length !== initialLength) {
        saveData(BOOKINGS_FILE, bookings);
        return true;
    }
    return false;
}

// Reset database
export function resetDatabase() {
    saveData(USERS_FILE, DEFAULT_USERS);
    saveData(BOOKINGS_FILE, []);
    console.log('🔄 Database reset');
}

// สร้าง directory ถ้ายังไม่มี
function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}
