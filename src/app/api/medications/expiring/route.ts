import { medicationStore } from '@/app/lib/medicationStore';
import { NextResponse } from 'next/server';
import { calculateRemainingDays } from '@/app/utils';

// GET medications expiring within 7 days
export async function GET() {
  try {
    const expiringSoon = medicationStore.getExpiringSoon(7);
    
    if (expiringSoon.length === 0) {
      return NextResponse.json(
        { medications: [], count: 0, message: 'No medications expiring soon' },
        { status: 200 }
      );
    }
    
    const medicationsWithDays = expiringSoon.map(med => {
      const daysRemaining = Math.floor(
        calculateRemainingDays(med.dosageRemaining, med.frequency)
      );
      
      return {
        ...med,
        daysRemaining,
      };
    });
    
    return NextResponse.json({
      medications: medicationsWithDays,
      count: medicationsWithDays.length,
      message: `${medicationsWithDays.length} medication${medicationsWithDays.length !== 1 ? 's' : ''} expiring soon`
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get expiring medications' },
      { status: 500 }
    );
  }
}