// src/app/components/medication/ExpiredMedicationsModal.tsx
'use client';

import Modal from '../ui/Modal';
import { Medication } from '../../types';

type ExpiredMedicationsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    medications: Medication[];
};

export default function ExpiredMedicationsModal({ 
    isOpen, 
    onClose, 
    medications 
}: ExpiredMedicationsModalProps) {
    
    const getDaysAgo = (refillDate: string): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const expiry = new Date(refillDate);
        expiry.setHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - expiry.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Expired Medications">
            <div className="space-y-3">
                {medications.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No expired medications</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">
                            {medications.length} medication{medications.length !== 1 ? 's have' : ' has'} expired
                        </p>
                        <div className="space-y-2">
                            {medications.map((med) => {
                                const daysAgo = getDaysAgo(med.refillDate);
                                return (
                                    <div 
                                        key={med.id} 
                                        className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{med.name}</p>
                                            <p className="text-xs text-gray-600">
                                                Remaining: {med.dosageRemaining} doses
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-red-700">
                                                {daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
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