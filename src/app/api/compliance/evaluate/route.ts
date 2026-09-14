import { NextResponse } from 'next/server';
import { evaluateEntity, materializeEntity } from '@/lib/compliance/actions';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const entityId = body.entityId as string | undefined;
  const mode = (body.mode as string | undefined) ?? 'evaluate';

  if (!entityId) {
    return NextResponse.json({ error: 'entityId is required' }, { status: 400 });
  }

  if (mode === 'materialize') {
    const result = await materializeEntity(entityId);
    return NextResponse.json(result);
  }

  const result = await evaluateEntity(entityId);
  return NextResponse.json(result);
}
