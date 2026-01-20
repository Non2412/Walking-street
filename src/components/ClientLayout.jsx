/**
 * Client Layout Component
 * ใช้สำหรับ wrap Client Components (เช่น AuthProvider)
 */

'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { MarketAuthProvider } from '@/contexts/MarketAuthContext';

export default function ClientLayout({ children }) {
    return (
        <AuthProvider>
            <MarketAuthProvider>
                {children}
            </MarketAuthProvider>
        </AuthProvider>
    );
}
