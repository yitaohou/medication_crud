import { Medication } from '@/app/types';
import { formatMedicationsForExport } from '@/app/utils';

export function exportRefillScheduleToCSV(medications: Medication[]) {
    const headers = ['Medication', 'Remaining Dosage', 'Frequency', 'Refill Date', 'Time Until', 'Status'];
    
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