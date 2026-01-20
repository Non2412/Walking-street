
'use client';

import { MarketAuthProvider } from '@/contexts/MarketAuthContext';
import Navbar from '@/components/Navbar';
import AdminDashboard from '@/components/AdminDashboard';

function DashboardContent() {
    return <AdminDashboard />;
}

export default function DashboardPage() {
    return (
        <MarketAuthProvider>
            <Navbar />
            <DashboardContent />
        </MarketAuthProvider>
    );
}

