import { medicationStore } from '@/app/lib/medicationStore';
import { NextResponse } from 'next/server';

// POST reset all medications
export async function POST() {
    try {
        medicationStore.clear();
        
        return NextResponse.json({ 
            message: 'All medications cleared successfully',
            count: 0 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to reset medications' },
            { status: 500 }
        );
    }
}