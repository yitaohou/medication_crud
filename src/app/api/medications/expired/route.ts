import { medicationStore } from '@/app/lib/medicationStore';
import { MedicationSummary } from '@/app/types';
import { getDaysAgo } from '@/app/utils';
import { NextResponse } from 'next/server';

// GET expired medications (dosageRemaining <= 0)
export async function GET() {
  try {
    const expired = medicationStore.getExpired();
    
    const medicationsSummaries: MedicationSummary[] = expired.map(med => {
      return {
        id: med.id,
        name: med.name,
        dosageRemaining: med.dosageRemaining,
        refillDate: med.refillDate,
        diffDays: getDaysAgo(med.refillDate),
      }
    });
    
    return NextResponse.json(medicationsSummaries);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get expired medications' },
      { status: 500 }
    );
  }
}