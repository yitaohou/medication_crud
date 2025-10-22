import { medicationStore } from '@/app/lib/medicationStore';
import { NextRequest, NextResponse } from 'next/server';

// POST take medication (decrease dosageRemaining by 1)
export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString)

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid medication ID' },
                { status: 400 }
            );
        }

        const medication = medicationStore.getById(id);

        if (!medication) {
            return NextResponse.json(
                { error: 'Medication not found' },
                { status: 404 }
            );
        }

        if (medication.dosageRemaining < 1) {
            return NextResponse.json(
                { error: 'No dosage remaining to take' },
                { status: 400 }
            );
        }

        const updatedMedication = medicationStore.update(id, {
            dosageRemaining: medication.dosageRemaining - 1
        });

        return NextResponse.json({
            message: 'Medication taken successfully',
            medication: updatedMedication
        });
    } catch (error) {
        console.error('Error taking medication:', error);
        return NextResponse.json(
            { error: 'Failed to take medication' },
            { status: 500 }
        );
    }
}