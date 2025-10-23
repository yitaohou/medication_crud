'use client';

import { useRouter } from 'next/navigation';
import { ActionType, Medication } from "@/app/types";
import { calculateMaxAllowance } from '@/app/utils';
import { useState } from 'react';
import { medicationEvents } from '@/app/lib/medicationEvents';

type ActionButtonsProps = {
    medication: Medication;
};

export default function ActionButtons({
    medication
}: ActionButtonsProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleMiss = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/medications/${medication.id}/miss`, {
                method: 'POST',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to mark medication as missed');
            }

            const result = await response.json();
            console.log('Missed:', result);

            router.refresh();

            medicationEvents.emit();
        } catch (error) {
            console.error('Error marking medication as missed:', error);
            alert(`Failed to mark ${medication.name} as missed`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTake = async () => {
        if (medication.dosageRemaining < 1) {
            alert('No dosage remaining!');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/medications/${medication.id}/take`, {
                method: 'POST',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to take medication');
            }

            const result = await response.json();
            console.log('Taken:', result);

            router.refresh();

            medicationEvents.emit();
        } catch (error) {
            console.error('Error taking medication:', error);
            alert(`Failed to take ${medication.name}`);
        } finally {
            setIsLoading(false);
        }
    };

    // We assume that the user cannot take more medication than they suppose to
    // e.g. they cant take 2 dosage if they are only allowed to take 1 dosage per day
    const maxAllowance = calculateMaxAllowance(medication.startDate, medication.frequency.per, medication.frequency.times, true);
    const currentAllowance = medication.dosageTotal - medication.dosageRemaining + medication.dosageMissed;

    const noDosageRemaining = medication.dosageRemaining < 1;
    const exceededAllowance = currentAllowance >= maxAllowance;
    const isDisabled = isLoading || noDosageRemaining || exceededAllowance;

    const getButtonTitle = (actionType: ActionType): string => {
        if (noDosageRemaining) return 'No dosage remaining';
        if (exceededAllowance) return 'Exceeded maximum allowance';
        if (isLoading) return 'Loading...';
        return actionType === ActionType.TAKE ? 'Mark as taken' : 'Mark as missed';
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleTake}
                disabled={isDisabled}
                className="btn bg-green-500 hover:bg-green-600"
                title={getButtonTitle(ActionType.TAKE)}
            >
                ✓ Take
            </button>
            <button
                onClick={handleMiss}
                disabled={isDisabled}
                className="btn bg-orange-500 hover:bg-orange-600"
                title={getButtonTitle(ActionType.MISS)}
            >
                ✗ Miss
            </button>
        </div>
    );
}