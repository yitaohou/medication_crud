'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon, WarningIcon } from '@/app/components/ui/Icon';
import Modal from '@/app/components/ui/Modal';
import { medicationEvents } from '@/app/lib/medicationEvents';

const STORAGE_KEY = 'medication_crud_backup';

export default function ResetButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReset = async () => {
        try {
            setIsLoading(true);

            const response = await fetch('/api/medications/reset', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to reset medications');
            }

            localStorage.removeItem(STORAGE_KEY);

            setIsModalOpen(false);

            router.refresh();

            medicationEvents.emit();

            alert('All medications have been cleared successfully!');
        } catch (error) {
            console.error('Error resetting medications:', error);
            alert('Failed to reset medications');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-lg bg-red-500 hover:bg-red-600 flex items-center gap-2"
                title="Clear all medications"
            >
                <TrashIcon className="w-5 h-5" />
                Reset All
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Reset All Medications?"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="reset-modal-icon-container">
                        <WarningIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                        This will permanently delete all medications from both the server and local storage.
                        <strong className="text-red-600"> This action cannot be undone.</strong>
                    </p>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="flex-1 btn bg-red-500 hover:bg-red-600"
                    >
                        {isLoading ? 'Resetting...' : 'Yes, Reset All'}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        disabled={isLoading}
                        className="flex-1 btn bg-gray-300 hover:bg-gray-400 text-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    );
}