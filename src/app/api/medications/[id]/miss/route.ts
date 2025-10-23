import { medicationStore } from '@/app/lib/medicationStore';
import { calculateMaxAllowance, getTodayDateString } from '@/app/utils';
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

        if (medication.dosageRemaining < 1) {
            return NextResponse.json(
                { error: 'No dosage remaining to miss' },
                { status: 400 }
            );
        }

        const maxAllowanceIncludingToday = calculateMaxAllowance(
            medication.startDate,
            medication.frequency.per,
            medication.frequency.times,
            true
        );

        const maxAllowanceUpToYesterday = calculateMaxAllowance(
            medication.startDate,
            medication.frequency.per,
            medication.frequency.times,
            false
        );

        const todayMaxAllowance = maxAllowanceIncludingToday - maxAllowanceUpToYesterday;

        const today = getTodayDateString();
        const currentAction = medication.lastDayAction;
        const currentTodayTotal = currentAction?.date === today
            ? (currentAction.take || 0) + (currentAction.miss || 0)
            : 0;

        if (currentTodayTotal >= todayMaxAllowance) {
            return NextResponse.json(
                { error: `Cannot miss more doses today. Maximum ${todayMaxAllowance} dose(s) allowed based on your schedule` },
                { status: 400 }
            );
        }

        const newLastDayAction = currentAction?.date === today
            ? { ...currentAction, miss: (currentAction.miss || 0) + 1 }
            : { date: today, miss: 1 };

        const updatedMedication = medicationStore.update(id, {
            dosageMissed: medication.dosageMissed + 1,
            lastDayAction: newLastDayAction
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