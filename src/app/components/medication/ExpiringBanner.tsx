'use client';

import { useState, useEffect } from 'react';
import { MedicationSummary } from '@/app/types';
import ExpiringMedicationsModal from '@/app/components/medication/ExpiringMedicationModal';
import { medicationEvents } from '@/app/lib/medicationEvents';
import { DEFAULT_EXPIRING_DAYS } from '@/app/const';

export default function ExpiringBanner() {
    const [data, setData] = useState<MedicationSummary[] | null>(null);
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

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <>
            <div className="alert-warning mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <strong className="text-yellow-800">⚠️ Alert:</strong>
                        <span className="ml-2 text-yellow-700">{data.length} medication{data.length !== 1 ? 's are' : ' is'} expiring within {DEFAULT_EXPIRING_DAYS} days</span>
                    </div>
                    {data.length > 0 && (
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
                medicationSummaries={data}
            />
        </>
    );
}