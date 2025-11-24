import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.errorMessage || !body.errorType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: errorMessage, errorType' },
        { status: 400 }
      );
    }

    // Store error in Firestore
    await addDoc(collection(db, 'analytics-errors'), {
      timestamp: serverTimestamp(),
      errorType: body.errorType,
      errorMessage: body.errorMessage,
      errorStack: body.errorStack || null,
      errorName: body.errorName || 'Error',
      componentStack: body.componentStack || null,
      url: body.url || request.headers.get('referer') || 'unknown',
      pathname: body.pathname || null,
      method: body.method || null,
      statusCode: body.statusCode || null,
      severity: body.severity || 'medium',
      additionalData: body.additionalData || {},
      userLanguage: body.userLanguage || 'unknown',
      sessionId: body.sessionId || null,
      userAgent: request.headers.get('user-agent') || 'unknown',
      viewport: body.viewport || { width: 0, height: 0 },
      platform: body.platform || 'unknown',
      browserLanguage: body.browserLanguage || 'unknown',
      // Add server-side context
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      origin: request.headers.get('origin') || 'unknown',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error storing error log:', error);
    // Don't fail silently - return error but don't break the app
    return NextResponse.json(
      { success: false, error: 'Failed to store error log' },
      { status: 500 }
    );
  }
}
