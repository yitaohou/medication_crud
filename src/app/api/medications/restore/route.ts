import { medicationStore } from '@/app/lib/medicationStore';
import { NextRequest, NextResponse } from 'next/server';
import { Medication } from '@/app/types';

export async function POST(request: NextRequest) {
    try {
        const medications: Medication[] = await request.json();
        
        medicationStore.clear();
        
        medications.forEach(med => {
            medicationStore.restore(med);
        });
        
        return NextResponse.json({ 
            message: 'Data restored successfully',
            count: medications.length 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to restore data' },
            { status: 500 }
        );
    }
}