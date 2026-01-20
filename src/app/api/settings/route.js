
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Return default settings
        const settings = { openDates: [], notifications: true };
        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { openDates } = body;

        // Save settings (in production, save to MongoDB)
        const newSettings = {
            openDates: openDates || [],
            notifications: true
        };

        return NextResponse.json({ success: true, data: newSettings });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}
