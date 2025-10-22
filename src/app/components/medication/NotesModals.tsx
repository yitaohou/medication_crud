'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getDrugByNDC, DrugDetail } from '../../lib/drugApi';

type NotesModalProps = {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    note: string;
    dnc?: string;
};

export default function NotesModal({ isOpen, onClose, name, note, dnc }: NotesModalProps) {
    const [medicationDetails, setMedicationDetails] = useState<DrugDetail | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setMedicationDetails(null);
            setIsLoadingDetails(false);
            setDetailsError(false);
            return;
        }

        if (dnc) {
            setIsLoadingDetails(true);
            setDetailsError(false);
            
            getDrugByNDC(dnc)
                .then((details) => {
                    if (details) {
                        setMedicationDetails(details);
                        setDetailsError(false);
                    } else {
                        setMedicationDetails(null);
                        setDetailsError(true);
                    }
                })
                .catch(() => {
                    setMedicationDetails(null);
                    setDetailsError(true);
                })
                .finally(() => {
                    setIsLoadingDetails(false);
                });
        }
    }, [isOpen, dnc]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Notes for ${name}`}
        >
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                    {note ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {note}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No notes available for this medication.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Medication Details</h3>
                    
                    {!dnc || detailsError || !medicationDetails  ? (
                        <p className="text-sm text-gray-500 italic">No details available</p>
                    ) : isLoadingDetails ? (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center gap-3">
                            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            <p className="text-sm text-blue-700">Loading medication details...</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                            {medicationDetails.route && medicationDetails.route.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Route</p>
                                    <p className="text-sm text-gray-800">{medicationDetails.route.join(', ')}</p>
                                </div>
                            )}

                            {medicationDetails.dosage_and_administration && medicationDetails.dosage_and_administration.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Dosage & Administration</p>
                                    <div className="text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto">
                                        {medicationDetails.dosage_and_administration.map((item, index) => (
                                            <p key={index} className="whitespace-pre-wrap">{item}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {medicationDetails.do_not_use && medicationDetails.do_not_use.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-red-600 uppercase mb-1">⚠️ Do Not Use</p>
                                    <div className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto bg-red-50 p-2 rounded">
                                        {medicationDetails.do_not_use.map((item, index) => (
                                            <p key={index} className="whitespace-pre-wrap">{item}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
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