/**
 * Persistent Mock Database using localStorage
 * ข้อมูลจะไม่หายแม้รีสตาร์ทเซิร์ฟเวอร์
 */

const STORAGE_KEY = 'walking_street_users_db';

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

// โหลดข้อมูลจาก localStorage
function loadFromStorage() {
    if (typeof window === 'undefined') {
        return DEFAULT_USERS; // Server-side: ใช้ default
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const users = JSON.parse(stored);
            console.log('📚 Loaded', users.length, 'users from localStorage');
            return users;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }

    // ถ้าไม่มีข้อมูล ใช้ default
    console.log('📝 Initializing with default users');
    saveToStorage(DEFAULT_USERS);
    return DEFAULT_USERS;
}

// บันทึกลง localStorage
function saveToStorage(users) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        console.log('💾 Saved', users.length, 'users to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// ค้นหา user ด้วย email
export function findUserByEmail(email) {
    const users = loadFromStorage();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    console.log('🔎 Search:', email, '→', found ? 'Found' : 'Not found');
    return found;
}

// เพิ่ม user ใหม่
export function addUser(user) {
    const users = loadFromStorage();

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
    saveToStorage(users);

    console.log('➕ Added user:', newUser.email);
    return newUser;
}

// ดึงข้อมูล users ทั้งหมด
export function getAllUsers() {
    return loadFromStorage();
}

// Reset database
export function resetDatabase() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        saveToStorage(DEFAULT_USERS);
        console.log('🔄 Database reset');
    }
}
