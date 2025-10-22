'use client';

import { useState } from 'react';
import { Medication } from '../../types';
import { exportRefillScheduleToPDF } from '../../lib/pdfExport';
import { exportRefillScheduleToCSV } from '../../lib/csvExport';

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
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                </svg>
                Export Schedule
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Export Medication Schedule
                        </h2>
                        
                        <p className="text-sm text-gray-600 mb-6">
                            Choose your preferred export format:
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={handleExportPDF}
                                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-gray-800">PDF Format</div>
                                    <div className="text-xs text-gray-500">Professional table layout</div>
                                </div>
                            </button>

                            <button
                                onClick={handleExportCSV}
                                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-gray-800">CSV Format</div>
                                    <div className="text-xs text-gray-500">Excel compatible spreadsheet</div>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}