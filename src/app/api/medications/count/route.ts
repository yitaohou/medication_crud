import { medicationStore } from '@/app/lib/medicationStore';
import { NextResponse } from 'next/server';

// GET medication count
export async function GET() {
  try {
    const medications = medicationStore.getAll();
    return NextResponse.json({ count: medications.length });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch medication count' },
      { status: 500 }
    );
  }
}