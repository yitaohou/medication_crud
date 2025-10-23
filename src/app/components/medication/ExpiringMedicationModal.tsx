'use client';

import Modal from '@/app/components/ui/Modal';
import { DEFAULT_EXPIRING_DAYS, MILLISECONDS_PER_DAY } from '@/app/const';
import { Medication } from '@/app/types';

type MedicationWithDays = Medication & {
    daysRemaining: number;
};

type ExpiringMedicationsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    medications: MedicationWithDays[];
};

export default function ExpiringMedicationsModal({ 
    isOpen, 
    onClose, 
    medications 
}: ExpiringMedicationsModalProps) {
    
    const getDaysUntil = (refillDate: string): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const expiry = new Date(refillDate);
        expiry.setHours(0, 0, 0, 0);
        
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / MILLISECONDS_PER_DAY);
        
        return diffDays;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Medications Expiring Soon">
            <div className="space-y-3">
                {medications.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No medications expiring soon</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">
                            {medications.length} medication{medications.length !== 1 ? 's are' : ' is'} expiring within {DEFAULT_EXPIRING_DAYS} days
                        </p>
                        <div className="space-y-2">
                            {medications.map((med) => {
                                const daysUntil = getDaysUntil(med.refillDate);
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
                                                {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
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