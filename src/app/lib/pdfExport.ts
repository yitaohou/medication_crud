// src/app/lib/pdfExport.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Medication } from '../types';
import { formatMedicationsForExport } from '../utils';

export function exportRefillScheduleToPDF(medications: Medication[]) {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Medication Refill Schedule', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, 14, 28);
    
    const tableData = formatMedicationsForExport(medications);
    
    autoTable(doc, {
        head: [['Medication', 'Dosage', 'Frequency', 'Refill Date', 'Time Until', 'Status']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: {
            fillColor: [59, 130, 246],  
            textColor: 255,
            fontStyle: 'bold',
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        columnStyles: {
            0: { cellWidth: 40 }, 
            1: { cellWidth: 25 }, 
            2: { cellWidth: 30 }, 
            3: { cellWidth: 30 }, 
            4: { cellWidth: 25 }, 
            5: { cellWidth: 20 }, 
        },
        didParseCell: function(data) {
            if (data.column.index === 5 && data.section === 'body') {
                const status = data.cell.text[0];
                if (status === 'Expired') {
                    data.cell.styles.textColor = [220, 38, 38]; 
                    data.cell.styles.fontStyle = 'bold';
                } else if (status === 'Soon') {
                    data.cell.styles.textColor = [234, 179, 8]; 
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },
        didDrawPage: function(data) {
            const pageCount = doc.internal.getNumberOfPages();
            const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
            
            doc.setFontSize(8);
            doc.text(
                `Page ${currentPage} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        },
    });
    
    doc.save(`medication-refill-schedule-${new Date().toISOString().split('T')[0]}.pdf`);
}