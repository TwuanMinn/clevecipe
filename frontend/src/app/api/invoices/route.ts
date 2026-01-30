import { NextResponse } from 'next/server';

// GET /api/invoices
export async function GET() {
    // TODO: Implement invoices logic
    return NextResponse.json({ message: 'Invoices endpoint' });
}

export async function POST(_request: Request) {
    // TODO: Implement invoices logic
    return NextResponse.json({ message: 'Invoices endpoint' });
}
