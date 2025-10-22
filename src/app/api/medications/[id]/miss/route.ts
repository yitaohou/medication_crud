import { medicationStore } from '@/app/lib/medicationStore';
import { NextRequest, NextResponse } from 'next/server';

// POST miss medication (increase dosageMissed by 1)
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

        const updatedMedication = medicationStore.update(id, {
            dosageMissed: medication.dosageMissed + 1
        });

        return NextResponse.json({
            message: 'Medication marked as missed',
            medication: updatedMedication
        });
    } catch (error) {
        console.error('Error marking medication as missed:', error);
        return NextResponse.json(
            { error: 'Failed to mark medication as missed' },
            { status: 500 }
        );
    }
}