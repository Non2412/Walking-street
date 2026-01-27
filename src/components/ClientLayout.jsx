/**
 * Client Layout Component
 * ใช้สำหรับ wrap Client Components (เช่น AuthProvider)
 */

'use client';

import { MarketAuthProvider } from '@/contexts/MarketAuthContext';

export default function ClientLayout({ children }) {
    return (
        <MarketAuthProvider>
            {children}
        </MarketAuthProvider>
    );
}
