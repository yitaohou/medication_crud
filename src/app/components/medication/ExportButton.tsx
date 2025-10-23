'use client';

import { useState } from 'react';
import { Medication } from '@/app/types';
import { exportRefillScheduleToPDF } from '@/app/lib/pdfExport';
import { exportRefillScheduleToCSV } from '@/app/lib/csvExport';
import { CSVIcon, ExportIcon, PDFIcon } from '@/app/components/ui/Icon';
import Modal from '@/app/components/ui/Modal';

type ExportButtonProps = {
    medications: Medication[];
};

export default function ExportButton({ medications }: ExportButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (medications.length === 0) {
        return null;
    }

    const handleExportPDF = () => {
        exportRefillScheduleToPDF(medications);
        setIsModalOpen(false);
    };

    const handleExportCSV = () => {
        exportRefillScheduleToCSV(medications);
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-lg bg-green-500 hover:bg-green-600 flex items-center gap-2"
            >
                <ExportIcon />
                Export Schedule
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Export Medication Schedule"
            >
                <p className="text-sm text-gray-600 mb-6">
                    Choose your preferred export format:
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleExportPDF}
                        className="export-modal-option hover:border-blue-500 hover:bg-blue-50 group"
                    >
                        <div className="export-modal-icon-container bg-red-100 group-hover:bg-red-200">
                            <PDFIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-800">PDF Format</div>
                            <div className="text-xs text-gray-500">Professional table layout</div>
                        </div>
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="export-modal-option hover:border-green-500 hover:bg-green-50 group"
                    >
                        <div className="export-modal-icon-container bg-green-100 group-hover:bg-green-200">
                            <CSVIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-800">CSV Format</div>
                            <div className="text-xs text-gray-500">Import into Excel or Sheets</div>
                        </div>
                    </button>
                </div>
            </Modal>
        </>
    );
}