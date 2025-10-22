// src/app/lib/csvExport.ts
import { Medication } from '../types';
import { formatMedicationsForExport } from '../utils';

export function exportRefillScheduleToCSV(medications: Medication[]) {
    const headers = ['Medication', 'Dosage Remaining', 'Dosage Total', 'Frequency', 'Start Date', 'Refill Date', 'Days Until Refill', 'Missed Doses', 'Notes'];
    
    const rows = formatMedicationsForExport(medications);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `medication-schedule-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}