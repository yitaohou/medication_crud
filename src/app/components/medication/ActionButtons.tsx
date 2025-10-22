'use client';

import { useRouter } from 'next/navigation';
import { Medication } from "../../types";
import { calculateMaxAllowance } from '../../utils';
import { useState } from 'react';

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
        } catch (error) {
            console.error('Error marking medication as missed:', error);
            alert(`Failed to mark ${medication.name} as missed`);
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
        } catch (error) {
            console.error('Error taking medication:', error);
            alert(`Failed to take ${medication.name}`);
        } finally {
            setIsLoading(false);
        }
    };

    // We assume that the user cannot take more medication than they suppose to
    // e.g. they cant take 2 dosage if they are only allowed to take 1 dosage per day
    const maxAllowance = calculateMaxAllowance(medication.startDate, medication.frequency.per, medication.frequency.times) + medication.frequency.times / medication.frequency.per;
    const currentAllowance = medication.dosageTotal - medication.dosageRemaining + medication.dosageMissed;

    const noDosageRemaining = medication.dosageRemaining < 1;
    const exceededAllowance = currentAllowance >= maxAllowance;
    const isDisabled = isLoading || noDosageRemaining || exceededAllowance;

    const getButtonTitle = (actionType: 'take' | 'miss'): string => {
        if (noDosageRemaining) return 'No dosage remaining';
        if (exceededAllowance) return 'Exceeded maximum allowance';
        if (isLoading) return 'Loading...';
        return actionType === 'take' ? 'Mark as taken' : 'Mark as missed';
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleTake}
                disabled={isDisabled}
                className="btn bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={getButtonTitle('take')}
            >
                ✓ Take
            </button>
            <button
                onClick={handleMiss}
                disabled={isDisabled}
                className="btn bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={getButtonTitle('miss')}
            >
                ✗ Miss
            </button>
        </div>
    );
}