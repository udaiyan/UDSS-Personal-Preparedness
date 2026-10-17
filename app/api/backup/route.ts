import { NextRequest, NextResponse } from 'next/server';
import { backupsMap, statusesMap } from '@/lib/server-store';

// Minimal rate-limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (entry.count >= 60) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in one minute.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { recoveryToken, prepId, encryptedPayload, headlineLevel } = body;

    if (!recoveryToken || typeof recoveryToken !== 'string' || recoveryToken.length < 16) {
      return NextResponse.json({ error: 'Invalid recovery token format.' }, { status: 400 });
    }
    if (!encryptedPayload || typeof encryptedPayload !== 'string') {
      return NextResponse.json({ error: 'Missing encrypted payload.' }, { status: 400 });
    }

    const updatedAt = new Date().toISOString();

    // Store encrypted backup keyed solely by high-entropy token
    backupsMap.set(recoveryToken, {
      recoveryToken,
      prepId: prepId || 'UDSS-ANON',
      encryptedPayload,
      updatedAt,
    });

    // Update public headline status if provided
    if (prepId && headlineLevel) {
      statusesMap.set(prepId, {
        prepId,
        headlineLevel,
        updatedAt,
      });
    }

    return NextResponse.json({ success: true, updatedAt });
  } catch {
    return NextResponse.json({ error: 'Failed to process encrypted backup.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in one minute.' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token || token.length < 16) {
    return NextResponse.json({ error: 'Valid recovery token is required.' }, { status: 400 });
  }

  const record = backupsMap.get(token);
  if (!record) {
    return NextResponse.json({ error: 'No encrypted backup found matching this recovery token.' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    encryptedPayload: record.encryptedPayload,
    prepId: record.prepId,
    updatedAt: record.updatedAt,
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token || token.length < 16) {
    return NextResponse.json({ error: 'Valid recovery token is required.' }, { status: 400 });
  }

  const existed = backupsMap.delete(token);
  return NextResponse.json({ success: existed });
}
