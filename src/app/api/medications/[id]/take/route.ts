import { medicationStore } from '@/app/lib/medicationStore';
import { calculateMaxAllowance, getTodayDateString } from '@/app/utils';
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

        // Calculate max allowance including today
        const maxAllowanceIncludingToday = calculateMaxAllowance(
            medication.startDate,
            medication.frequency.per,
            medication.frequency.times,
            true
        );

        // Calculate max allowance up to yesterday
        const maxAllowanceUpToYesterday = calculateMaxAllowance(
            medication.startDate,
            medication.frequency.per,
            medication.frequency.times,
            false
        );

        // Today's max allowance is the difference
        const todayMaxAllowance = maxAllowanceIncludingToday - maxAllowanceUpToYesterday;

        const today = getTodayDateString();
        const currentAction = medication.lastDayAction;
        const currentTodayTotal = currentAction?.date === today
            ? (currentAction.take || 0) + (currentAction.miss || 0)
            : 0;

        if (currentTodayTotal >= todayMaxAllowance) {
            return NextResponse.json(
                { error: `Cannot take more doses today. Maximum ${todayMaxAllowance} dose(s) allowed based on your schedule` },
                { status: 400 }
            );
        }

        const newLastDayAction = currentAction?.date === today
            ? { ...currentAction, take: (currentAction.take || 0) + 1 }
            : { date: today, take: 1 };

        const updatedMedication = medicationStore.update(id, {
            dosageRemaining: medication.dosageRemaining - 1,
            lastDayAction: newLastDayAction
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