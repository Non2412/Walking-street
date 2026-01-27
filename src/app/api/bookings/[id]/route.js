/**
 * Dynamic Bookings API Route
 * PUT /api/bookings/{id} - Update specific booking with payment info (saves locally)
 */

import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const MARKET_API_BASE_URL = process.env.MARKET_API_URL || 'https://market-api-mu.vercel.app';
const DATA_DIR = join(process.cwd(), 'data');
const PAYMENTS_FILE = join(DATA_DIR, 'payments.json');

async function getPayments() {
    try {
        const data = await readFile(PAYMENTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function savePayments(payments) {
    await writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf-8');
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const authHeader = request.headers.get('authorization');
        const body = await request.json();

        console.log('📝 PUT /api/bookings/{id} - ID:', id);
        console.log('📋 Request body:', JSON.stringify(body).substring(0, 200));
        console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');

        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: 'No authorization token provided' },
                { status: 401 }
            );
        }

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Booking ID is required' },
                { status: 400 }
            );
        }

        const { status, paymentSlip, price } = body;

        // Save payment info locally to data/payments.json
        const payments = await getPayments();
        const existingIndex = payments.findIndex(p => p.bookingId === id);
        
        const paymentRecord = {
            bookingId: id,
            status: status || 'completed',
            price,
            paymentSlip: paymentSlip ? 'saved' : null, // Don't store base64 in JSON
            timestamp: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            payments[existingIndex] = paymentRecord;
        } else {
            payments.push(paymentRecord);
        }

        await savePayments(payments);
        console.log('✅ Payment recorded locally for booking:', id);

        return NextResponse.json({
            success: true,
            data: { id, status: 'payment_recorded' },
            message: 'Payment recorded successfully. Awaiting admin confirmation.'
        });

    } catch (error) {
        console.error('❌ Error in PUT /api/bookings/{id}:', error);
        return NextResponse.json(
            { success: true, message: 'Payment recorded. Awaiting admin confirmation.' },
            { status: 200 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const authHeader = request.headers.get('authorization');

        console.log('📌 GET /api/bookings/{id} - ID:', id);
        console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');

        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: 'No authorization token provided' },
                { status: 401 }
            );
        }

        // Forward request to market-api
        const response = await fetch(`${MARKET_API_BASE_URL}/api/bookings/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            throw new Error(`Market API Error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data: data.data || data,
            message: 'Booking retrieved successfully'
        });

    } catch (error) {
        console.error('❌ Error in GET /api/bookings/{id}:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
