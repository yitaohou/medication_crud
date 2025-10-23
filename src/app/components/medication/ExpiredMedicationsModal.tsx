// src/app/components/medication/ExpiredMedicationsModal.tsx
'use client';

import Modal from '@/app/components/ui/Modal';
import { MILLISECONDS_PER_DAY } from '@/app/const';
import { MedicationSummary } from '@/app/types';

type ExpiredMedicationsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    medicationSummaries: MedicationSummary[];
};

export default function ExpiredMedicationsModal({ 
    isOpen, 
    onClose, 
    medicationSummaries 
}: ExpiredMedicationsModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Expired Medications">
            <div className="space-y-3">
                {medicationSummaries.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No expired medications</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">
                            {medicationSummaries.length} medication{medicationSummaries.length !== 1 ? 's have' : ' has'} expired
                        </p>
                        <div className="space-y-2">
                            {medicationSummaries.map((med) => {
                                return (
                                    <div 
                                        key={med.id} 
                                        className="modal-warning-cell bg-red-50  border-red-200  hover:bg-red-100"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{med.name}</p>
                                            <p className="text-xs text-gray-600">
                                                Remaining: {med.dosageRemaining} doses
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-red-700">
                                                {med.diffDays === 0 ? 'Today' : `${med.diffDays} day${med.diffDays !== 1 ? 's' : ''} ago`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(med.refillDate).toLocaleDateString('en-US')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
                
                <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                    <button
                        onClick={onClose}
                        className="btn bg-gray-500 hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}