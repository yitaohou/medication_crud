'use client';

import { useState, useEffect } from 'react';
import ExpiredMedicationsModal from '@/app/components/medication/ExpiredMedicationsModal';
import { MedicationSummary } from '@/app/types';
import { medicationEvents } from '@/app/lib/medicationEvents';

export default function ExpiredBanner() {
    const [data, setData] = useState<MedicationSummary[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchExpired() {
            const res = await fetch('/api/medications/expired', {
                cache: 'no-store',
            });
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        }
        fetchExpired();

        const unsubscribe = medicationEvents.subscribe(() => {
            fetchExpired();
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
            <div className="alert-danger mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <strong className="text-red-800">🚨 Alert:</strong>
                        <span className="ml-2 text-red-700">{data.length} medication{data.length !== 1 ? 's have' : ' has'} expired</span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-button text-red-800 hover:text-red-900"
                    >
                        View All
                    </button>
                </div>
            </div>
            <ExpiredMedicationsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                medicationSummaries={data}
            />
        </>
    );
}