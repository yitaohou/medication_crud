import { medicationStore } from '@/app/lib/medicationStore';
import { NextRequest, NextResponse } from 'next/server';

// GET single medication by ID
export async function GET(
    request: NextRequest,
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

        return NextResponse.json(medication);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch medication' },
            { status: 500 }
        );
    }
}

// PUT update medication
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString)
        const body = await request.json();

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid medication ID' },
                { status: 400 }
            );
        }

        const updatedMedication = medicationStore.update(id, body);

        if (!updatedMedication) {
            return NextResponse.json(
                { error: 'Medication not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedMedication);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update medication' },
            { status: 500 }
        );
    }
}

// DELETE medication
export async function DELETE(
    request: NextRequest,
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

        const success = medicationStore.delete(id);

        if (!success) {
            return NextResponse.json(
                { error: 'Medication not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Medication deleted successfully',
            id
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete medication' },
            { status: 500 }
        );
    }
}
