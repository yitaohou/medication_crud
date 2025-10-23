'use client';

import { useState, useEffect } from 'react';
import { Medication } from '@/app/types';
import ExpiringMedicationsModal from '@/app/components/medication/ExpiringMedicationModal';
import { medicationEvents } from '@/app/lib/medicationEvents';

type MedicationWithDays = Medication & {
    daysRemaining: number;  
};

export default function ExpiringBanner() {
    const [data, setData] = useState<{ medications: MedicationWithDays[], count: number, message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchExpiring() {
            const res = await fetch('/api/medications/expiring', {
                cache: 'no-store',
            });
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        }
        fetchExpiring();

        const unsubscribe = medicationEvents.subscribe(() => {
            fetchExpiring();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (!data || data.count === 0) {
        return null;
    }

    return (
        <>
            <div className="alert-warning mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <strong className="text-yellow-800">⚠️ Alert:</strong>
                        <span className="ml-2 text-yellow-700">{data.message}</span>
                    </div>
                    {data.count > 0 && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="text-button text-yellow-800 hover:text-yellow-900"
                        >
                            View All
                        </button>
                    )}
                </div>
            </div>
            <ExpiringMedicationsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                medications={data.medications}
            />
        </>
    );
}