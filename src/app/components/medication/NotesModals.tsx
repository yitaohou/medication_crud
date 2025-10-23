'use client';

import { useState, useEffect } from 'react';
import Modal from '@/app/components/ui/Modal';
import { getDrugByNDC, DrugDetail } from '@/app/lib/drugApi';

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
                    <h3 className="detail-modal-title">Notes</h3>
                    {note ? (
                        <div className="detail-modal-note-wrapper">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {note}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No notes available for this medication.</p>
                    )}
                </div>

                <div>
                    <h3 className="detail-modal-title">Medication Details</h3>

                    <div className="text-xs text-gray-500 italic mb-2 text-wrap">
                        *Note: The information provided below is for general reference only and should not be construed as medical advice.
                    </div>

                    {isLoadingDetails ? (
                        <LoadingSkeleton />
                    ) : medicationDetails && dnc && !detailsError ? (
                        <div className="detail-modal-note-wrapper">
                            <MedicationDetailSection
                                title="Route"
                                content={medicationDetails.route || []}
                            />

                            <MedicationDetailSection
                                title="Dosage & Administration"
                                content={medicationDetails.dosage_and_administration || []}
                            />

                            <MedicationDetailSection
                                title="⚠️ Do Not Use"
                                content={medicationDetails.do_not_use || []}
                                titleColor="text-red-600"
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No details available</p>
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

type MedicationDetailSectionProps = {
    title: string;
    content: string[];
    titleColor?: string;
};

function MedicationDetailSection({
    title,
    content,
    titleColor = "text-gray-600",
}: MedicationDetailSectionProps) {
    if (!content || content.length === 0) {
        return null;
    }

    return (
        <div>
            <p className={`text-xs font-semibold ${titleColor} uppercase mb-1`}>
                {title}
            </p>
            <div className={`text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto`}>
                {content.map((item, index) => (
                    <p key={index} className="whitespace-pre-wrap">
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-sm text-blue-700">Loading medication details...</p>
        </div>
    );
}