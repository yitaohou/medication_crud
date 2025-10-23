'use client';

import Modal from '@/app/components/ui/Modal';
import { DEFAULT_EXPIRING_DAYS } from '@/app/const';
import { MedicationSummary } from '@/app/types';

type ExpiringMedicationsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    medicationSummaries: MedicationSummary[];
};

export default function ExpiringMedicationsModal({ 
    isOpen, 
    onClose, 
    medicationSummaries 
}: ExpiringMedicationsModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Medications Expiring Soon">
            <div className="space-y-3">
                {medicationSummaries.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No medications expiring soon</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">
                            {medicationSummaries.length} medication{medicationSummaries.length !== 1 ? 's are' : ' is'} expiring within {DEFAULT_EXPIRING_DAYS} days
                        </p>
                        <div className="space-y-2">
                            {medicationSummaries.map((med) => {
                                return (
                                    <div 
                                        key={med.id} 
                                        className="modal-warning-cell bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{med.name}</p>
                                            <p className="text-xs text-gray-600">
                                                Remaining: {med.dosageRemaining} doses
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-yellow-700">
                                                {med.diffDays === 0 ? 'Today' : med.diffDays === 1 ? 'Tomorrow' : `In ${med.diffDays} days`}
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