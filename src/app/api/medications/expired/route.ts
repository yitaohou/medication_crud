// /Users/yitaohou/medication_crud/src/app/api/medications/expired/route.ts
import { medicationStore } from '@/app/lib/medicationStore';
import { NextResponse } from 'next/server';

// GET expired medications (dosageRemaining <= 0)
export async function GET() {
  try {
    const expired = medicationStore.getExpired();
    
    if (expired.length === 0) {
      return NextResponse.json(
        { medications: [], count: 0, message: 'No expired medications' },
        { status: 200 }
      );
    }
    
    return NextResponse.json({
      medications: expired,
      count: expired.length,
      message: `${expired.length} medication${expired.length !== 1 ? 's have' : ' has'} expired`
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get expired medications' },
      { status: 500 }
    );
  }
}