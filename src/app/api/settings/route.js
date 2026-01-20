
import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/mockDb';

export async function GET() {
    try {
        const settings = getSettings();
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

        const currentSettings = getSettings();
        const newSettings = {
            ...currentSettings,
            openDates: openDates || currentSettings.openDates
        };

        const saved = saveSettings(newSettings);
        return NextResponse.json({ success: true, data: saved });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}
