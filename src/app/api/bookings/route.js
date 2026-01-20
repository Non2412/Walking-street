/**
 * Bookings API Route
 * GET /api/bookings - Get all bookings with Bearer token
 * POST /api/bookings - Create new booking
 */

import { NextResponse } from 'next/server';

const MARKET_API_BASE_URL = process.env.MARKET_API_URL || 'https://market-api-mu.vercel.app';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        
        console.log('📌 GET /api/bookings - Auth header:', authHeader ? 'Present' : 'Missing');

        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: 'No authorization token provided' },
                { status: 401 }
            );
        }

        // Forward request to market-api with Bearer token
        console.log('🔄 Forwarding to market-api:', `${MARKET_API_BASE_URL}/api/bookings`);
        
        const response = await fetch(`${MARKET_API_BASE_URL}/api/bookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader, // Pass token as-is
            },
        });

        console.log('📊 Market API response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`❌ Market API Error: ${response.status}`, errorData);
            throw new Error(`Market API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Data from market-api:', data);

        return NextResponse.json({
            success: true,
            data: data.data || data,
            message: 'Bookings retrieved successfully'
        });

    } catch (error) {
        console.error('❌ Error in GET /api/bookings:', error.message);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        const body = await request.json();

        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: 'No authorization token provided' },
                { status: 401 }
            );
        }

        // Forward request to market-api
        const response = await fetch(`${MARKET_API_BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Market API Error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data: data.data || data,
            message: 'Booking created successfully'
        });

    } catch (error) {
        console.error('❌ Error in POST /api/bookings:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
