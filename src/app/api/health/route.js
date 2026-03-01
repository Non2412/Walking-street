
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

export async function GET() {
    const status = {
        env_var_present: !!process.env.MONGODB_URI,
        connection_state: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
        timestamp: new Date().toISOString()
    };

    // Friendly state message
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    status.state_message = states[status.connection_state] || 'unknown';

    try {
        if (process.env.MONGODB_URI) {
            await dbConnect();
            status.connection_test = "Success";
            status.connection_state = mongoose.connection.readyState;
            status.state_message = states[status.connection_state];
        } else {
            status.connection_test = "Skipped (No URI)";
        }
    } catch (error) {
        status.connection_test = "Failed";
        status.error = error.message;
    }

    return NextResponse.json(status);
}
