import { medicationStore } from '@/app/lib/medicationStore';
import { MedicationSummary } from '@/app/types';
import { getDaysUntil } from '@/app/utils';
import { NextResponse } from 'next/server';

// GET medications expiring within 7 days
export async function GET() {
  try {
    const expiringSoon = medicationStore.getExpiringSoon();

    const medicationsSummaries: MedicationSummary[] = expiringSoon.map(med => {
      return {
        id: med.id,
        name: med.name,
        dosageRemaining: med.dosageRemaining,
        refillDate: med.refillDate,
        diffDays: getDaysUntil(med.refillDate),
      }
    });

    return NextResponse.json(medicationsSummaries);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get expiring medications' },
      { status: 500 }
    );
  }
}