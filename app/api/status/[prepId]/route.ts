import { NextRequest, NextResponse } from 'next/server';
import { statusesMap } from '@/lib/server-store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ prepId: string }> }
) {
  const { prepId } = await params;
  if (!prepId) {
    return NextResponse.json({ error: 'UDSS Prep ID required' }, { status: 400 });
  }

  const decodedPrepId = decodeURIComponent(prepId).trim().toUpperCase();

  // Normalize spaces / hyphens e.g. "UDSS-3456" -> "UDSS 3456"
  const normalizedKey = decodedPrepId.replace('-', ' ');

  const record = statusesMap.get(normalizedKey);

  if (!record) {
    // If not found in memory, simulate or generate consistent mock headline level if it fits pattern
    const match = normalizedKey.match(/^UDSS\s?(\d{4})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const levels: Array<'Need to get going' | 'Partially prepared' | 'Fully prepared'> = [
        'Need to get going',
        'Partially prepared',
        'Fully prepared',
      ];
      const level = levels[num % 3];
      return NextResponse.json({
        prepId: normalizedKey,
        headlineLevel: level,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: 'UDSS Prep ID not found.' }, { status: 404 });
  }

  return NextResponse.json({
    prepId: record.prepId,
    headlineLevel: record.headlineLevel,
    updatedAt: record.updatedAt,
  });
}
