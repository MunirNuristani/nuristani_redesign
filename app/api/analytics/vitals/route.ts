import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Store web vitals in Firestore
    await addDoc(collection(db, 'analytics-web-vitals'), {
      timestamp: serverTimestamp(),
      ...body,
      userAgent: request.headers.get('user-agent') || 'unknown',
      url: request.headers.get('referer') || 'unknown',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error storing web vitals:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
